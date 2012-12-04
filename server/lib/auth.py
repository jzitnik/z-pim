
from lib.request import Request
from lib.response import Response
import os
from hashlib import md5
from lib.service import Service
import psycopg2
import datasources
import Cookie

class SQLAuth(object):
	
	def __init__(self):
		pass
	
	def authenticate(self, login, password):
		pwd = md5(str(password)).hexdigest()
		
		user = False
		conn = Service.getDbConn()
		try:
			user = {}
			cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
			cursor.execute("SELECT * FROM pim.users WHERE login = %s AND password = %s AND active = true", (login, pwd))
			
			for row in cursor.fetchall():
				user['user_id'] = row['user_id']
				user['role'] = row['role']
				
			
		finally:
			Service.putDbConn(conn)
		
		self.loggedUser = user
		return user
		
	def persistLogin(self, ipAddress):
		conn = datasources.postgres.SQLTransaction()
		
		cursor = conn.cursor()
		cursor.execute("""INSERT INTO pim.users_tokens (user_id, ip_address)
		VALUES (%s, %s) RETURNING token""", (self.loggedUser['user_id'], ipAddress))
		
		token = cursor.fetchone()
		conn.commit()
		conn.close()
		
		return token[0]
		
	def checkByToken(self, token):
		conn = datasources.postgres.SQLTransaction()
		user = {}
		cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
		cursor.execute("""
			SELECT * FROM pim.users
			WHERE user_id IN (
				SELECT user_id FROM pim.users_tokens
				WHERE token = %s
			)""", [token])
			
		row = cursor.fetchone()
		if row:
			user['user_id'] = row['user_id']
			user['role'] = row['role']
		
		conn.close()
		self.loggedUser = user
		return user
		

class AuthRequest(Request):
	authClass = SQLAuth
	
	def __init__(self, environ):
		self.loggedUser = None
		
		Request.__init__(self, environ)
	
	def checkAuth(self):
		login = self.getAttr("login")
		pwd = self.getAttr("password")
		persist = self.getAttr("persist")
		
		auth = self.authClass()
		user = auth.authenticate(login, pwd)
		
		self.authToken = None
		
		if user:
			self.session['user_id'] = user["user_id"]
			self.session['user_role'] = user['role']
			
			if persist == "on":
				self.session['authToken'] = auth.persistLogin("")
				
	
	def checkAuthByToken(self, token):
		auth = self.authClass()
		user = auth.checkByToken(token)
		if user:
			self.session['user_id'] = user["user_id"]
			self.session['user_role'] = user['role']
	
	def dispatch(self):
		cookie = Cookie.SimpleCookie(self.environ.get("HTTP_COOKIE",""))
		if 'authToken' in cookie:
			token = cookie["authToken"].value
			self.checkAuthByToken(token)
		
		if not self.loggedUser:
			self.checkAuth()
		
		path = os.path.join(os.path.dirname(__file__), "..", "templates", "login.html")
		htmlFile = open(path, "r")
		content = htmlFile.read()
		htmlFile.close()
		
		r = Response(content, encoder=None)
		r.setHeaders([
			('Content-type', "text/html")
		])
		
		return r

	
