# -*- coding: utf-8 -*-

import vsbParser
import lib.dataTypes as types
from lib.sqlReport import * 

class VsbTimetable:
	
	columns = [
		Column({
			'id': "id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Název předmětu",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.String(),
		}),
		
	]
	
	def __init__(self, session):
		self.session = session
	
	def getData(self, query):
		data = None
		if 'code' in query and query['code']:
			data = vsbParser.getLessons(query['code'].replace("*", "").encode("utf8"))
			
		elif 'name' in query and query['name']:
			data = vsbParser.getLessonsList(query['name'].replace("*", "").encode("utf8"))
			
		return {
			'data': data
		}
		
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols