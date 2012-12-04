
def classDecor(self, *args, **kwargs):
	# Do something with 'self'
	print self
	return target(self, *args, **kwargs)

class decorator (object):
	def __init__ (self, func):
		self.func = func

	def __call__ (self, * args):
		return self.func (*args)
		
	
#class Test(object):

	#def __init__(self, key):
		#self.key = key
	
	#@decorator
	#def foo(self, arg1):
		#print "FOO", arg1, self
	

import functools

class decorator2(object):

	def __init__(self, caller):
		self.caller = caller
		self.cache = {}

	def __call__(self, *args):
		functionName = self.caller.__name__
		#if (functionName not in self.cache):
			#self.cache[functionName] = self.f(*args)
		#else:
			#print "using cache"
		print "CALLING", functionName
		return self.caller(*args)

	def __get__(self, instance, instancetype):
		print "__GET__", instance
		instance.dbConn = "ASDF"
		try:
			return functools.partial(self.__call__, instance)
		finally:
			instance.dbConn = None
		
		
class Test2(object):

	def __init__(self, key):
		self.key = key

	@decorator2
	def foo(self, arg1):
		print "FOO", arg1, dir(self)

	@decorator2
	def bar(self, arg1):
		print "FOO", arg1, self

	

b = Test2("qwer")
b.foo("baz")
b.foo("baz")
b.foo("baz")
b.foo("baz")
b.bar("baz")

c = Test2("qwerty")
c.foo("hovno")

def classDecor(f):
	return f
		
@classDecor
class decorated(object):
	pass
		
#a = Test("ASdfasdf")
#a.foo("bar")

#a.foo("bar")

#a.foo("bar")

#a = None
#print "-------"
#a = Test("ASdfasdf")
#a.foo("bar")




print "-------"
c = decorated()