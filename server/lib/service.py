


class Service(object):
	
	postgresPool = None
	
	@staticmethod
	def getPostgresPool():
		#TODO check if postgres is initiated
		
		if not Service.postgresPool:
			import datasources
			#Service.postgresPool = datasources.postgres.ConnectionPool()
		
		return Service.postgresPool

	@staticmethod
	def getDbConn():
		#TODO check if postgres is initiated

		if not Service.postgresPool:
			import datasources
			#Service.postgresPool = datasources.postgres.ConnectionPool()

		return Service.postgresPool.getconn()
		
	@staticmethod
	def putDbConn(conn):
		if not Service.postgresPool:
			import datasources
			
		return Service.postgresPool.putconn(conn)