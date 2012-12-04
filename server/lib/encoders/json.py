
import simplejson as json
import StringIO
from datetime import datetime

class TypedEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime):
			return obj.isoformat()
			
		return json.JSONEncoder.default(self, obj)


#class ComplexEncoder(json.JSONEncoder):
	#def default(self, obj):
		#if isinstance(obj, datetime):
			#return datetime.strptime(obj, "%Y-%m-%d %H:%M:%S")
		#return json.JSONEncoder.default(self, obj)

	
	
def encode(result):
	if type(result) in (list, dict, tuple):
		content = StringIO.StringIO()
		
		encoder = TypedEncoder()
		
		content.write(encoder.encode(result))

		return content
	elif type(result) in (str, int, bool, unicode, float):
		content = StringIO.StringIO()
		content.write(str(result))
		return content
	else:
		return result