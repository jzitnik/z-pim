# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Settings(Module):
	table = "pim.settings"
	columns = [
		Column({
			'name': u"Název",
			'id': "key",
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True,
			'flags': ['primaryKey']
		}),
		Column({
			'name': u"Hodnota",
			'id': "value",
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		})
	]
	
	
	def insert(self, data):
		if type(data) != list:
			data = [data]
		
		pKeys = []
		
		for i in data:
			delete = SQLDelete(self.table)
			delete.setColumns(self.columns + [
				Column({
					'id': "user_id",
				})
			])
			delete.setFilter({
				'user_id': self.session['user_id'],
				'key': i['key']
			})
			delete.delete()
			
			result = SQLInsert(self.table)
			result.setColumns(self.columns)
			result.setData(i)
			result.setAdditionalData({
				'user_id': self.session['user_id']
			})
			pKeys.append(result.insert())
		
		
		return pKeys
	

	
