
from datetime import datetime

class IType(object):

	def __init__(self):
		raise Exception("Not implemented yet")

	def validate(self, value):
		raise Exception("Not implemented yet")

	def __str__(self):
		raise Exception("Not implemented yet")
	
	def encode(self, value):
		return value
	
	def decode(self, value):
		return value


class String(IType):
	regexp = None
	def __init__(self, regexp = None):
		self.regexp = regexp

	def validate(self, value):
		if not self.regexp:
			return True

		return False

	def __str__(self):
		return 'String'
		
		
class Integer(IType):
	regexp = None
	def __init__(self, regexp = None):
		self.regexp = regexp

	def validate(self, value):
		if not self.regexp:
			return True

		return False

	def __str__(self):
		return 'Integer'
		
class Date(IType):
	regexp = None
	def __init__(self, regexp = None):
		self.regexp = regexp

	def validate(self, value):
		if not self.regexp:
			return True

		return False

	def __str__(self):
		return 'Date'
		
	def decode(self, value):
		value = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
		return value
		
		
class Boolean(IType):
	regexp = None
	def __init__(self, regexp = None):
		self.regexp = regexp

	def validate(self, value):
		if not self.regexp:
			return True

		return False

	def __str__(self):
		return 'Boolean'
		
		
class Label(Integer):
	def __str__(self):
		return 'Label'


#class Days(Integer):
	#def __str__(self):
		#return 'Integer' # return 'Days'
		

class HTML(String):
	def __str__(self):
		return 'HTML'

		
class Password(String):
	def __str__(self):
		return 'Password'
		
class EmailMessage(String):
	def __str__(self):
		return 'EmailMessage'

class UserRole(String):
	def __str__(self):
		return 'UserRole'
		
class Color(String):
	def __str__(self):
		return 'Color'
		
class DateTime(Date):

	def __str__(self):
		return 'DateTime'
		
		
class ContactParams(IType):
	regexp = None
	def __init__(self, regexp = None):
		self.regexp = regexp

	def validate(self, value):
		if not self.regexp:
			return True

		return False
		
	def __str__(self):
		return 'ContactParams'
