
from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres
import psycopg2

class Contacts(Module):
	table = "pim.contacts"
	columns = [
		Column({
			'id': "contact_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': "name",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': "description",
			'id': "description",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.HTML(),
			'editable': True,
			'insertable': True
		}),
		#Column({
			#'name': "params",
			#'id': "params",
			##'validator': RegexpValidator("^[0-9]$"),
			#'visibility': ["static", "edit"],
			#'required': False,
			#'type': types.ContactParams(),
			#'editable': True,
			#'insertable': True
		#})
	]
	
	def getData(self, query = {}, limit = 0, offset = 0):
		result = SQLReport("SELECT * FROM pim.contacts %(where)s %(order)s %(limit)s")
		result.setColumns(self.columns)
		result.setFixedFilter("user_id = '%s'" % self.session['user_id'])
		result.setFilter(query)
		
		contacts = result.getReport()
		
		#conn = Service.getDbConn()
		#cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
		
		#for value in contacts['data']:
			#cursor.execute("SELECT * FROM pim.contacts_params WHERE contact_id = %s", [value['contact_id']])
		
			#params = cursor.fetchall()
			
			#value['params'] = params
			
		#Service.putDbConn(conn)
		
		return contacts
		
	
