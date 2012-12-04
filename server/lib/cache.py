
class Cache(object):
	

	def __call__(self):
		print "CACHE INIT"


class SessionCached(Cache):


	def __call__(self):
		print "sess CACHE INIT"