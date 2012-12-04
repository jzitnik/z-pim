# -*- coding: utf-8 -*-

from lib.module import Module

import lib.dataTypes as types
from lib.sqlReport import * 

class SmtpSettings(Module):
	table = "pim.smtp_accounts"
	
	columns = [
		Column({
			'id': "smtp_account_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Název účtu",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Login",
			'id': "login",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Heslo",
			'id': "password",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Password(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Host",
			'id': "host",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Port",
			'id': "port",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Integer(),
			'editable': True,
			'insertable': True,
			'default': 443
		}),
		Column({
			'name': u"SSL",
			'id': "ssl",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Boolean(),
			'editable': True,
			'insertable': True
		})
		
	]
