# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *
from hashlib import md5

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Users(Module):
	table = "pim.users"
	columns = [
		Column({
			'name': "user_id",
			'id': "user_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.Integer(),
			'editable': False,
			'insertable': False,
			'flags': ['primaryKey']
		}),
		Column({
			'name': "login",
			'id': "login",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': False,
			'insertable': True
		}),
		Column({
			'name': "password",
			'id': "password",
			#'validator': IntervalValidator(
				#(100, 200),
				#(500, 600)
			#),
			'visibility': ["edit"],
			'required': False,
			'type': types.Password(),
			'editable': True,
			'insertable': True,
			'value': "***"
		}),
		Column({
			'name': u"Jméno",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': "email",
			'id': "email",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
	]
	
	adminColumns = [
		Column({
			'name': "role",
			'id': "role",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.UserRole(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': "active",
			'id': "active",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.Boolean(),
			'editable': False,
			'insertable': False
		})
	]
	
	def __init__(self, session):
		self.session = session
		
		if self.session['user_role'] == "admin":
			self.columns += self.adminColumns
			
	def getData(self, query = {}):
		result = SQLReport("SELECT * FROM pim.users %(where)s %(order)s %(limit)s")
		result.setColumns(self.columns)
		
		if self.session['user_role'] != "admin":
			result.setFilter({
				'user_id': self.session['user_id']
			})
		else:
			result.setFilter(query)
		
		return result.getReport()
		
	def update(self, key, data):
		
		if 'password' in data:
			if data['password'] == "***":
				del data['password']
			else:
				data['password'] = md5(data['password']).hexdigest()
				
		if 'role' in data and self.session['user_role'] != "admin":
			del data['role']
		
		result = SQLUpdate(self.table)
		result.setColumns(self.columns)
		result.setKey(key)
		result.setData(data)
		
		#test
		result.update()
		
		return {}
		
	def insert(self, data):
		if type(data) != list:
			data = [data]
		
		print "ROLE", self.session['user_role']
		
		if self.session['user_role'] != "admin":
			return  {
				'status': "ERROR",
				'error': "Nejste root"
			};
		
		pKeys = []
		print "INC DATA", data
		for i in data:
			
			if 'password' in i:
				i['password'] = md5(i['password']).hexdigest()
				
			result = SQLInsert(self.table)
			result.setColumns(self.columns)
			result.setData(i)
			pKeys.append(result.insert())
		
		#conn.commit()
		#conn.close()
		print "PKEYS", pKeys
		
		return pKeys
	
	

	
