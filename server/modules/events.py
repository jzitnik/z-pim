# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Events(Module):
	table = "pim.events"
	columns = [
		Column({
			'id': "object_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.Integer(),
			'editable': False,
			'insertable': False,
			'flags': ['primaryKey']
		}),
		Column({
			'name': u"Štítky",
			'id': "labels",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.Label(),
			'editable': True,
			'insertable': True,
			'searchAlias': ""
		}),
		Column({
			'name': u"Vytvořeno",
			'id': "created",
			#'validator': IntervalValidator(
				#(100, 200),
				#(500, 600)
			#),
			'visibility': ["static"],
			'required': False,
			'type': types.Date(),
			'editable': False,
			'insertable': False
		}),
		Column({
			'name': u"Začátek",
			'id': "task_start",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.DateTime(),
			'editable': True,
			'insertable': True,
			'searchAlias': "task_start::date <= %s::date + INTERVAL '1 day'"
		}),
		Column({
			'name': u"Konec",
			'id': "task_end",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.DateTime(),
			'editable': True,
			'insertable': True,
			'searchAlias': "task_end::date >= %s::date + INTERVAL '1 day'"
		}),
		Column({
			'name': u"Název",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Popis",
			'id': "description",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.HTML(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Dokončeno",
			'id': "finished",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Boolean(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Opakování",
			'id': "recurrence",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Integer(),
			'editable': True,
			'insertable': True,
			'default': 0
		}),
		Column({
			'name': u"Interval opakování",
			'id': "recurrence_interval",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Integer(),
			'editable': True,
			'insertable': True
		})
	]
	
	def getData(self, query, limit, offset):
		
		print "QUERY", query
		
		dateQuery = None
		if query and 'date_range' in query and type(query['date_range']) == list and len(query['date_range']) > 1 :
			dateQuery = "task_start::date >= '%s'::date + INTERVAL '1 day' AND task_end::date <= '%s'::date + INTERVAL '1 day'" % (query['date_range'][0], query['date_range'][1])
			del query['date_range']
		
		result = SQLReport("""SELECT * FROM pim.events %(where)s %(order)s %(limit)s""")
		result.setColumns(self.columns)
		
		result.setFixedFilter("user_id = '%s'" % self.session['user_id'])
		
		if query and 'labels' in query:
			
			if type(query['labels']) == list:
				result.addFilter("""
					object_id IN (
						SELECT object_id FROM pim.objects_labels
						WHERE label IN ('%s')
					)
				""" % "', '".join(query['labels']) )
			
			del query['labels']
		
		result.setFilter(query)
		
		if dateQuery:
			result.addFilter(dateQuery)
			
		
			
		#result.addFilter("user_id = '%s'" % self.session['user_id'])
		
		#result.setLimit(0, 100)
		#result.setOrder({
			#"category_id": "DESC"
		#})
		
		return result.getReport()
		
		
	def insert(self, data):
		
		conn = datasources.postgres.SQLTransaction()
		
		labels = None
		
		
		for i in data:
			labels = None
			if 'labels' in i:
				labels = i['labels']
				del i['labels']
			
			result = SQLInsert(self.table, conn)
			result.setColumns(self.columns)
			result.setData(i)
			result.setAdditionalData({
				'user_id': self.session['user_id']
			})
			eventIds = result.insert()
		
			print "EVTID", eventIds
			
			if labels:
				#for eId in eventIds:
				cursor = conn.cursor()
				for label in labels:
					cursor.execute("SELECT pim.assign_label(%s, '%s', %s)" % (
						eventIds['object_id'], label, self.session['user_id']
					))
		
		conn.commit()
		conn.close()
		
		return {
			'status': "OK",
			'rowId': eventIds['object_id']
		}
		
	#def update(self, taskId = 0, data = {'a': 'b'}):
		
		#conn = datasources.postgres.SQLTransaction()
		
		#result = SQLUpdate("categories", conn)
		#result.setColumns(self.columns)
		#result.setKey({
			#"task_id": taskId
		#})
		#result.setData(data)
		
		##test
		#result.update()
		
		#return {}
	
	
	

	
