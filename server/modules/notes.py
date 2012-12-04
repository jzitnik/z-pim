# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Notes(Module):
	table = "pim.notes"
	columns = [
		Column({
			'id': "object_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Štítky",
			'id': "labels",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit"],
			'required': True,
			'type': types.Label()
		}),
		Column({
			'name': u"Vytvořeno",
			'id': "created",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static"],
			'required': False,
			'type': types.Date()
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
			'name': u"Poznámka",
			'id': "note",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.HTML(),
			'editable': True,
			'insertable': True
		})
	]
	
	def getData(self, query = None, limit = None, offset = None):
		result = SQLReport("""SELECT N.*,
			(SELECT array_agg(label) FROM pim.objects_labels WHERE object_id = N.object_id) AS labels
			FROM %s N %s""" % (self.table, "%(where)s %(order)s %(limit)s"))
		result.setColumns(self.columns)
		result.setFixedFilter("user_id = '%s'" % self.session['user_id'])
		result.setFilter(query)
		
		if limit and offset:
			result.setLimit(limit, offset)
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
		
		return {}
		
	def update(self, key, data):
		
		conn = datasources.postgres.SQLTransaction()
		
		labels = None
		
		
		labels = None
		if 'labels' in data:
			labels = data['labels']
			del data['labels']
		
		result = SQLUpdate(self.table, conn)
		result.setColumns(self.columns)
		result.setData(data)
		result.setKey(key)
		#result.setAdditionalData({
			#'user_id': self.session['user_id']
		#})
		eventIds = result.update()
	
		print "EVTID", eventIds
		
		if labels:
			cursor.execute("DELETE FROM pim.objects_labels WHERE object_id = %s", [key['object_id']])
			cursor = conn.cursor()
			for label in labels:
				cursor.execute("SELECT pim.assign_label(%s, '%s', %s)" % (
					eventIds['object_id'], label, self.session['user_id']
				))
		
		conn.commit()
		conn.close()
		
		return {}
	
