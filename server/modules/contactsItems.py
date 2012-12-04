
from contactsParams import ContactsParams
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class ContactsItems(ContactsParams):
	
	def getData(self, query = None, limit = None, offset = None):
		result = SQLReport("""SELECT P.* FROM %s P
		INNER JOIN pim.contacts C ON (C.contact_id = P.contact_id)
		
		%s""" % (self.table, "%(where)s %(order)s %(limit)s"))
		result.setColumns(self.columns)
		result.setFilter(query)
		
		result.setFixedFilter("C.user_id = '%s'" % self.session['user_id'])
		
		if limit and offset:
			result.setLimit(limit, offset)
		
		return result.getReport()
	

