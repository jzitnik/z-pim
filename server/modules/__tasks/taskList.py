
#from engines.sqlengine import *

from lib.module import Module
from lib.cache import *

#from lib.decorators import *
import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class TaskList(Module):
	
	columns = [
		Column({
			'name': "task_id",
			'id': "task_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String()
		}),
		Column({
			'name': "task_name",
			'id': "task_name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String()
		}),
		Column({
			'name': "task_int",
			'id': "task_int",
			#'validator': IntervalValidator(
				#(100, 200),
				#(500, 600)
			#),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String()
		})
	
	]

	
	def __init__(self):
		pass

	def __default__(self):
		#return self.getData()
		return self.update()
		
	def getData(self):
		#pass
		
		result = SQLReport("SELECT * FROM pim.categories %(where)s %(order)s %(limit)s")
		result.setColumns(self.columns)
		result.setFilter({
			"category_id": 2
		})
		result.setLimit(0, 100)
		result.setOrder({
			"category_id": "DESC"
		})
		
		return result.getReport()
		
		
	def update(self, taskId = 0, data = {'a': 'b'}):
		
		conn = datasources.postgres.SQLTransaction()
		
		result = SQLUpdate("categories", conn)
		result.setColumns(self.columns)
		result.setKey({
			"task_id": taskId
		})
		result.setData(data)
		
		#test
		result.update()
		
		return {}
	
	
	

	
