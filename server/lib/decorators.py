
import simplejson as json
import inspect
from lib.service import Service
import traceback
import sys

def SQLTransaction(function):

	arg_names = inspect.getargspec(function)[0]

	def wrapped(self, *args):
		for name, value in zip(arg_names[1:], args):
			setattr(self, name, value)

		conn = Service.getPostgresPool().getconn()
		cursor = conn.cursor()
		cursor.execute("BEGIN")
		#self.cursor = cursor
		
		try:
			return function(self, cursor, *args)
			cursor.execute("COMMIT")
			
		except Exception, e:
			cursor.execute("ROLLBACK")
			print e
			
			traceback.print_exc(file=sys.stdout)
			
		finally:
			Service.getPostgresPool().putconn(conn)

	return wrapped