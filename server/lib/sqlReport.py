import psycopg2
#import psycopg2.extras
#from lib.types import *

#standart python types
import dataTypes

from lib.service import Service
from datasources.postgres import SQLTransaction

class Column(object):
	acceptInfo = ['name', 'id', 'visibility', 'required', 'insertable', 'editable', 'flags', 'default']
	
	def __init__(self, args):
		self.type = dataTypes.String()
		self.id = None
		self.searchAlias =  None
		self.info = {}
		self.validator = lambda x: True
		
		for i in args:
			if i in self.acceptInfo:
				self.info[i] = args[i]
		#self.info = filter(lambda x: x in self.acceptInfo, args)
		
		if 'validator' in args:
			self.validator = args['validator']
			
		if 'type' in args:
			if isinstance(args['type'], dataTypes.IType):
				self.type = args['type']
			else:
				raise Exception("Wrong validator class")

		if 'id' in args:
			self.id = args['id']
			
		if 'searchAlias' in args:
			self.searchAlias = args['searchAlias']
			
		if 'value' in args:
			self.value = args['value']
			
			
	def __str__(self):
		return self.id
	
	def getId(self):
		return self.id
	
	def parse(self, value):
		return value

	def getInfo(self):
		info = self.info
		info['type'] = str(self.type)
		return info
		
	def isEditable(self):
		if 'editable' in self.info and self.info['editable'] == True:
			return True
		return False
		
	def isInsertable(self):
		if 'insertable' in self.info and self.info['insertable'] == True:
			return True
		return False
		
	def isPrimaryKey(self):
		if 'flags' in self.info and 'primaryKey' in self.info['flags']:
			return True
		return False
		
	def encodeValue(self, value):
		return self.type.encode(value)
		
	def decodeValue(self, value):
		return self.type.decode(value)
		
	def getStaticValue(self):
		if hasattr(self, 'value'):
			return self.value
		return None


class ColumnParser(object):
	
	#columns = []
	##self.columnsIds = []
	#columnsEditable = []
	#columnsInsertable = []
	#data = []
	#dataInfo = {}
	
	def addColumn(self, column):
		self.columns.append(column)
		self.__proccessColumns()
		
	def setColumns(self, columns):
		self.columns = columns
		self.__proccessColumns()
	
	def __proccessColumns(self):
		self.columnsFilter = []
		self.columnsEditable = []
		self.columnsInsertable = []
		self.primaryKeys = []
		self.columnsIndex = {}
		self.columnStaticValues = {}
		
		for col in self.columns:
			field = col.getId()
			if not field:
				continue
			
			self.columnsFilter.append(field)
			
			if col.isEditable() == True:
				self.columnsEditable.append(field)
				
			if col.isInsertable() == True:
				self.columnsInsertable.append(field)
				
			if col.isPrimaryKey() == True:
				self.primaryKeys.append(field)
				
			self.columnsIndex[field] = self.columns.index(col)
			
			if col.getStaticValue():
				self.columnStaticValues[field] = col.getStaticValue()
		
	def __validateColumn(self, colId, value):
		pass
	
	def setAdditionalData(self, data):
		self.addData = data
		
	def setData(self, data):
		self.data = data
		
	def decodeValue(self, obj):
		if not hasattr(self, 'columns'):
			return
			
		for i in obj:
			if i in self.columnsIndex:
				col = self.columns[self.columnsIndex[i]]
				
				obj[i] = col.decodeValue(obj[i])
				
		return obj
		
	def encodeValue(self, obj):
		if not hasattr(self, 'columns'):
			return
			
		for i in obj:
			if i in self.columnsIndex:
				col = self.columns[self.columnsIndex[i]]
				
				obj[i] = col.decodeValue(obj[i])
				
		return obj
		
	def getPrimaryKey(self):
		pks = []
		for i in this.columns:
			if i.isPrimaryKey() == True:
				pks.append(i)
				
		return pks
		
		
class SQLReport(ColumnParser):
	
	def __init__(self, query):
		self.query = query
		self.where = None
		self.orders = None
		self.limit = None
		self.filter = []
		self.fixedFilter = None
		self.conn = Service.getDbConn()
	
	def __parseQuery(self):
		
		where = " AND ".join(self.filter)
		if where:
			where = "(%s)" % where
		
		if where or self.fixedFilter:
			fixedFilter = ""
			if self.fixedFilter:
				fixedFilter = "%s" % self.fixedFilter
				
				if where:
					fixedFilter = "(%s) AND " % fixedFilter
				
			where = "WHERE %s %s" % (fixedFilter, where)
		
		order = ""
		if self.orders:
			order = "ORDER BY " + self.orders
			
		limit = ""
		if self.limit:
			limit = self.limit
		
		query =  self.query % {
			"where": where,
			"order": order,
			"limit": limit
		}
		print "===PARSED QUERY==", query.encode("utf8")
		return query
	
	def getReport(self):
		report = {}
		
		self.data = []
		self.dataInfo = {}
		
		#try:
		self.data = []
		cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
		cursor.execute(self.__parseQuery())
		
		sqlCols = []
		for col in cursor.description:
			sqlCols.append(col[0])
		
		for row in cursor.fetchall():
			for i in row.keys():
				if i not in self.columnsFilter:
					del row[i]
					
				if i in self.columnStaticValues:
					row[i] = self.columnStaticValues[i]
					
			self.data.append(row)
		
		#report['data'] = filter(lambda x: x in self.columnsFilter, self.data)
		report['data'] = self.data
		
		report['dataInfo'] = self.dataInfo
		
		report['columns'] = {}
		for col in self.columns:
			colId = col.getId()
			report['columns'][colId] = col.getInfo()
				
		#finally:
			#Service.putDbConn(conn)
			
		return report
		
	def setFixedFilter(self, query):
		self.fixedFilter = query
			
		
	def setFilter(self, query, join = "AND"):
		if not query or type(query) not in [dict, list]:
			return
		
		if type(query) == dict:
			query = [query]
		
		self.filter = []
			
		join = " %s " % join
		
		cursor = self.conn.cursor()
		
		for args in query:
			outer = []
			args = self.decodeValue(args)
			for item in args:
				
				col = self.columns[self.columnsIndex[item]]
				
				if col.searchAlias:
					outer.append(cursor.mogrify(col.searchAlias, [args[item]]))
				else:
					if type(args[item]) in [str, unicode] and args[item][-1:] == "*":
						#USE ILIKE OPERATOR
						outer.append("%s ILIKE '%s%%'" % (item, args[item][0:-1]))
					else:
						outer.append("%s = '%s'" % (item, args[item]))
				
			self.filter.append(join.join(outer))
				
	
	def addFilter(self, arg):
		if type(arg) in [str, unicode]:
			self.filter.append(arg)
		
	
	def setOrder(self, args):
		orders = []
		for item in args:
			orders.append("%s %s" % (item, args[item]))
		self.orders = ", ".join(orders)
	
	
	def setLimit(self, offset, limit):
		self.limit = ""
		if limit:
			self.limit += "LIMIT %d " % limit
		if offset:
			self.limit += "OFFSET %d" % offset
			
	def __del__(self):
		Service.putDbConn(self.conn)

class SQLUpdate(ColumnParser):
	
	table = None
	key = None
	query = "UPDATE %(table)s SET %(setter)s %(where)s"
	sqlConn = None
	useTransaction = False
	
	def __init__(self, table, connection = None):
		self.table = table
		
		if connection:
			self.sqlConn = connection
			self.useTransaction = True
		else:
			self.sqlConn = SQLTransaction()
			
	
	def __del__(self):
		if self.useTransaction == False:
			self.sqlConn.close()
	
	def setKey(self, key):
		self.key = key
		
	def update(self):
		qry = self.__parseQuery()
		
		cursor = self.sqlConn.cursor()
		cursor.execute(qry)
		
		if not self.useTransaction:
			self.sqlConn.commit()
			self.sqlConn.close()
		
		return True
		
	def __parseQuery(self):
		
		cursor = self.sqlConn.cursor()
		
		setterArray = []
		for key in self.data:
			#if type(self.data[key]) in [str, unicode]:
				#self.data[key] = self.data[key].encode("utf8")
				
			setterArray.append(cursor.mogrify("%s = %s" % (key.encode("utf8"), "%s"), [self.data[key]]))
			
		setter = ", ".join(setterArray)
		
		where = ""
		if self.key:
			if type(self.key) == dict:
				keyArray = []
				for i in self.key:
					keyArray.append(cursor.mogrify("%s = %s" % (i.encode("utf8"), "%s"), [self.key[i]]))
				
				key = " AND ".join(keyArray)
				
			#elif type(key) == list:
				#TODO!!!
				
			where = " WHERE %s" % key
			
		query = self.query % {
			'table': self.table,
			'setter': setter,
			'where': where
		}
		print "PARSEED QRY", query
		return query
		
		
class SQLInsert(ColumnParser):
	
	#table = None
	query = "INSERT INTO %(table)s (%(columns)s) VALUES (%(values)s)"
	#sqlConn = None
	#useTransaction = False
	
	def __init__(self, table, connection = None):
		self.table = table
		self.addData = {}
		if connection:
			self.sqlConn = connection
			self.useTransaction = True
		else:
			self.sqlConn = SQLTransaction()
			self.useTransaction = False
		
		
	def insert(self):
		qry = self.__parseQuery()
		
		self.data.update(self.addData)
		
		cursor = self.sqlConn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
		cursor.execute(qry, self.data)
		
		returns = []
		for row in cursor.fetchall():
			returns.append(row)
		
		if not self.useTransaction:
			self.sqlConn.commit()
			#self.sqlConn.close()
		
		return returns[0]
		
	def __parseQuery(self):
		data = []
		keys = []
		
		returning = ""
		
		if len(self.primaryKeys) > 0:
			returning = " RETURNING " + ",".join(self.primaryKeys)
		
		for key in self.data:
			if key not in self.columnsInsertable:
				continue
			
			data.append("%%(%s)s" % key)
			keys.append(key)
			
		for key in self.addData:
			data.append("%%(%s)s" % key)
			keys.append(key)
			
		#keys = set(keys)
		#data = set(data)
			
		query = self.query % {
			'table': self.table,
			'columns': ", ".join(keys),
			'values': ", ".join(data)
		}
		print "QRY", query + returning
		return query + returning
	
	def __del__(self):
		if self.useTransaction == False:
			self.sqlConn.close()
	
	
class SQLDelete(ColumnParser):
	
	table = None
	query = "DELETE FROM %(table)s %(where)s"
	sqlConn = None
	useTransaction = False
	
	def __init__(self, table, connection = None):
		self.table = table
		
		if connection:
			self.sqlConn = connection
			self.useTransaction = True
		else:
			self.sqlConn = SQLTransaction()
		
	#def setFilter(self, args, join = "AND"):
		#filters = []
		#for item in args:
			#if item in self.searchAliases:
				#filters.append(self.searchAliases[item] % args[item])
			#else:
				#filters.append("%s = '%s'" % (item, args[item]))
				
		#self.where = join.join(filters)
		
	def delete(self):
		qry = self.__parseQuery()
		
		cursor = self.sqlConn.cursor()
		cursor.execute(qry)
		
		if not self.useTransaction:
			self.sqlConn.commit()
			self.sqlConn.close()
		
		return True
		
	def __parseQuery(self):
		
		query = self.query % {
			'table': self.table,
			'where': "WHERE " + " OR ".join(self.filter)
		}
		
		return query
		
	def __del__(self):
		if self.useTransaction == False:
			self.sqlConn.close()
			
			
	def setFilter(self, query, join = "AND"):
		if not query or type(query) not in [dict, list]:
			return
		
		if type(query) == dict:
			query = [query]
		
		self.filter = []
			
		join = " %s " % join
		
		cursor = self.sqlConn.cursor()
		
		for args in query:
			outer = []
			args = self.decodeValue(args)
			for item in args:
				
				col = self.columns[self.columnsIndex[item]]
				
				if col.searchAlias:
					outer.append(cursor.mogrify(col.searchAlias, [args[item]]))
				else:
					if type(args[item]) in [str, unicode] and args[item][-1:] == "*":
						#USE ILIKE OPERATOR
						outer.append("%s ILIKE '%s%%'" % (item, args[item][0:-1]))
					else:
						outer.append("%s = '%s'" % (item, args[item]))
				
			self.filter.append(join.join(outer))
	