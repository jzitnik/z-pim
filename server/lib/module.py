
import datasources
from lib.sqlReport import *

class Module:

	def __init__(self, session):
		self.session = session
	
	def __default__(self):
		return self.__class__.__name__ + " module index"
		
	def getData(self, query = None, limit = None, offset = None):
		result = SQLReport("SELECT * FROM %s %s" % (self.table, "%(where)s %(order)s %(limit)s"))
		result.setColumns(self.columns)
		result.setFixedFilter("user_id = '%s'" % self.session['user_id'])
		
		
		if limit and offset:
			result.setLimit(limit, offset)
		
		
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
			
		return result.getReport()
		
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols
		
	def update(self, key, data):
		
		#conn = datasources.postgres.SQLTransaction()
		
		result = SQLUpdate(self.table)
		result.setColumns(self.columns)
		result.setKey(key)
		result.setData(data)
		
		#test
		result.update()
		
		return {}
		
	def insert(self, data):
		if type(data) != list:
			data = [data]
		
		#conn = datasources.postgres.SQLTransaction()
		
		pKeys = []
		
		for i in data:
			
			result = SQLInsert(self.table)
			result.setColumns(self.columns)
			result.setData(i)
			result.setAdditionalData({
				'user_id': self.session['user_id']
			})
			pKeys.append(result.insert())
		
		#conn.commit()
		#conn.close()
		
		return pKeys
		
	def delete(self, key):
		
		#conn = datasources.postgres.SQLTransaction()
		
		result = SQLDelete(self.table)
		result.setColumns(self.columns)
		result.setFilter(key)
		
		#test
		result.delete()
		
		return {}
		