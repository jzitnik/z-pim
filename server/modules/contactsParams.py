
from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class ContactsParams(Module):
	table = "pim.contacts_params"
	columns = [
		Column({
			'id': "param_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': "contact",
			'id': "contact_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit"],
			'required': True,
			'type': types.String(),
			'insertable': True
		}),
		Column({
			'name': "param",
			'id': "param",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': "value",
			'id': "value",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		})
		
	]
	
	def getData(self, query = None, limit = None, offset = None):
		result = SQLReport("SELECT * FROM %s %s" % (self.table, "%(where)s %(order)s %(limit)s"))
		result.setColumns(self.columns)
		result.setFilter(query)
		
		if limit and offset:
			result.setLimit(limit, offset)
		
		return result.getReport()
	
	def insert(self, data):
		if type(data) != list:
			data = [data]
		
		#conn = datasources.postgres.SQLTransaction()
		
		pKeys = []
		
		for i in data:
			
			result = SQLInsert(self.table)
			result.setColumns(self.columns)
			result.setData(i)
			#result.setAdditionalData({
				#'contact_id': i['contact_id']
			#})
			pKeys.append(result.insert())
		
		return pKeys
	
