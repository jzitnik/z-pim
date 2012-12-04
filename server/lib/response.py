
import json

import os
import lib.encoders.json
import StringIO

class Response:

	def __init__(self, content, encoder = "json"):
		
		self.statusCode = '200 OK'

		self.content = None
		self.chunkSize = 1024
		
		self.headers = [
			('Content-type', "text/plain"),
		]
		
		self.encoder = encoder
		self.setContent(content)
		
	def getStatusCode(self):
		return self.statusCode
	
	def getHeaders(self):
		headers = self.headers
		headers.append(('Content-Length', str(self.content.len)))
		headers.append(("Pragma", "no-cache")) 
		headers.append(("Expires", "-1")) 
		headers.append(("Cache-control", "no-cache"))
		return headers
	
	def setHeaders(self, headers):
		self.headers = headers
		
	def addHeaders(self, headers):
		self.headers += headers
	
	def setContent(self, content):
		if self.encoder == "json":
			self.content = lib.encoders.json.encode(content)
		else:
			#string
			self.content = StringIO.StringIO()
			self.content.write(content)
	
	def next(self):
		data = self.content.read(self.chunkSize)
		if not data:
			raise StopIteration
	
		return data
	
	
	def __iter__(self):
		self.content.seek(0)
		return self


