
from lib.errors import errors
from cgi import parse_qs, escape, FieldStorage
from cStringIO import StringIO
from copy import copy
import re
from lib.response import Response
import modules
import types
import inspect
import json
import os
import urlparse
import types
import Cookie
import datetime
import datasources

class Request:
	"""
	Object for parsing HTTP request
	"""
	
	def __init__(self, environ):
		self.parseRequest(environ)

		self.format = self.getAttr("format") # json | xml | ...?

		if not self.format:
			self.format = "json"
		
		
	def dispatch(self):
		#URL mapovani na objekty
		
		print "POST", self.post
		print "GET", self.get
		
		dispatcherMethod = None
		
		url = re.findall(r'([^/]+)', self.environ['PATH_INFO'])
		
		if len(url) == 0 or (len(url) == 1 and url[0] == "logout"):
			
			if len(url) == 1 and url[0] == "logout":
				cookie = Cookie.SimpleCookie(self.environ.get("HTTP_COOKIE",""))
				if 'authToken' in cookie:
					token = cookie["authToken"].value
				
					conn = datasources.postgres.SQLTransaction()
					cursor = conn.cursor()
					cursor.execute("DELETE FROM pim.users_tokens WHERE user_id = %s AND token = %s",
					(self.session['user_id'], token))
					
					conn.commit()
					conn.close()
				
				self.session['user_id'] = None
				self.session.invalidate()
			
			path = os.path.join(os.path.dirname(__file__), "..", "templates", "index.html")
			htmlFile = open(path, "r")
			content = htmlFile.read()
			htmlFile.close()
			
			r = Response(content, encoder=None)
			r.setHeaders([
				('Content-type', "text/html")
			])
			
			if 'authToken' in self.session:
				expiration = datetime.datetime.now() + datetime.timedelta(days=30)
				cookie = Cookie.SimpleCookie()
				cookie['authToken'] = self.session['authToken']
				cookie['authToken']['expires'] = expiration.strftime('%a, %d %b %Y %H:%M:%S GMT')
				r.addHeaders([('Set-Cookie', cookie['authToken'].OutputString())])
			
			return r
		
		dispatcherClass = None
		dispatcherMethod = '__default__'
		
		#root node
		pointer = modules
		for part in url:
			if hasattr(pointer, part) and type(getattr(pointer, part)) in [types.ClassType, types.ModuleType]:
				pointer = getattr(pointer, part)
				dispatcherClass = pointer
				continue
			
			dispatcherMethod = part
			
		#deprecated
		if not dispatcherClass:
			dispatcherClass = errors
			dispatcherMethod = "notFound"
			
		dispatcher = dispatcherClass(self.session)
		calee = getattr(dispatcher, dispatcherMethod)
		
		attrs = inspect.getargspec(calee)[0]
		
		requestData = {}
		if 'request' in self.request:
			print self.request['request'].encode("utf8")
			requestData = json.loads(self.request['request'].encode("utf8"))
			
			
		print "REQUEST", requestData
		
		for parameter in requestData.keys():
			if parameter not in attrs:
				del requestData[parameter]
		
		return Response(calee(**requestData), encoder=self.format)

		##serve encoded
		#if 
		
		
	
	def getAttr(self, name):
		if name in self.request:
			return self.request[name]
		else:
			return None
		
	
	def parseRequest(self, environ):
		
		try:
			request_body_size = int(environ.get('CONTENT_LENGTH', 0))
		except (ValueError):
			request_body_size = 0
		
		req = environ['QUERY_STRING']
		self.get = parse_qs(req)
		
		#print "INPUT", dir(environ['wsgi.input'])
		request_body = environ['wsgi.input'].read(request_body_size)
		environ['wsgi.input'] = StringIO(request_body)
		
		self.post = urlparse.parse_qs(request_body)
		
		self.environ = environ
		
		#prevod na human-readable
		request = {}
		for param in self.get:
			request[param] = self.get[param][0].decode("string-escape")
		
		for param in self.post:
			value = self.post[param][0]
			if type(value) == unicode:
				value = value.decode("string-escape")
			elif type(value) == str:
				try:
					value = unicode(value, "utf-8")
				except Exception, e:
					continue
		
			request[param] = value
		
		self.request = copy(request)
		
		self.session = environ['beaker.session']

