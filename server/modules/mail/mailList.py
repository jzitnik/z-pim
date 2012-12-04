# -*- coding: utf-8 -*-

import lib.dataTypes as types
from lib.sqlReport import * 

from maillib.imap import Imap

class MailList:
	
	columns = [
		Column({
			'id': "mail_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Předmět",
			'id': "subject",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'id': "sender",
			'name': "Odesílatel",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'id': "date",
			'name': "Datum",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Date(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'id': "folder",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		})
	] 
	
	def __init__(self, session):
		self.session = session
	
	def getData(self, query = {}, limit = None):
		
		imapHandler = Imap(self.session['user_id'], query['accountId'])
		
		if query and 'folder_id' in query:
			mails = imapHandler.getMailList(query['folder_id'])
		else:
			mails = imapHandler.getMailList()
		
		imapHandler.close()
		return  {
			'data': mails,
			'columns': self.getColumns()
		}
		
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols
 
