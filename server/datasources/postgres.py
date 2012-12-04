# -*- coding: utf-8 -*-
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
import psycopg2.extensions
import psycopg2.extras
from config.config import Config
from lib.service import Service

psycopg2.extensions.register_type(psycopg2.extensions.UNICODE)
psycopg2.extensions.register_type(psycopg2.extensions.UNICODEARRAY)

class ConnectionPool(ThreadedConnectionPool):
	"""
	There's no option how enable auto-commint for connections in ThreadedConnectionPool (or any other).
	So this class just overloads B{getconn} method and sets ISOLATION LEVEL to AUTOCOMMIT.
	"""
	
	dsn = None
	
	def __init__(self, minConn, maxConn, dsn):
		self.dsn = dsn
		return ThreadedConnectionPool.__init__(self, minConn, maxConn, dsn)
	
	
	def getconn(self):
		"""
		Gets connection from parent class, enables AUTOCOMMIT and returns requested connection.

		@rtype: object
		@return: connection with isolation level set to autocommit
		"""
		#calledBy = traceback.extract_stack()[-2]
		#logging.info("GETCONN - FILE: " + calledBy[0] + ", LINE: " + str(calledBy[1]) + ", METHOD: " + calledBy[2])

		conn = ThreadedConnectionPool.getconn(self)

		try:
			#conn.set_isolation_level(psycopg2.extensions.ISOLATION_LEVEL_AUTOCOMMIT)
			conn.cursor().execute("SELECT 1")

		except (psycopg2.OperationalError, psycopg2.InterfaceError, psycopg2.InternalError):
			key = self._rused[id(conn)]
			del self._rused[id(conn)]
			conn = psycopg2.connect(self.dsn)
			self._rused[id(conn)] = key

		if Config.hstoreEnabled == True:
			try:
				psycopg2.extras.register_hstore(conn)
			except Exception, e:
				Config.hstoreEnabled = False

		conn.set_client_encoding('UNICODE')
		
		#conn.cursor().cursor_factory=psycopg2.extras.DictCursor
		
		return conn


	def putconn(self, conn):
		"""
		Returns connection back to pool.

		"""

		#calledBy = traceback.extract_stack()[-2]
		#logging.info("PUTCONN - FILE: " + calledBy[0] + ", LINE: " + str(calledBy[1]) + ", METHOD: " + calledBy[2])

		ThreadedConnectionPool.putconn(self, conn)


	def query(self, sqlQuery, mogrify = None):

		conn = self.getconn()
		result = None
		try:
			cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
			cursor.execute(sqlQuery, mogrify)

			result = cursor.fetchone()
		finally:
			self.putconn(conn)

		return result

class SQLTransaction(object):
	conn = None
	
	def __init__(self):
		self.conn = Service.postgresPool.getconn()
		
	def cursor(self, **args):
		print "ENC", self.conn.encoding
		return self.conn.cursor(**args)
		
	def rollback(self):
		self.conn.rollback()
		
	def commit(self):
		self.conn.commit()
		
	def close(self):
		Service.postgresPool.putconn(self.conn)
		
Service.postgresPool = ConnectionPool(1, 50, Config.postgres)
