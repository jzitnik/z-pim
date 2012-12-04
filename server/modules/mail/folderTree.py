# -*- coding: utf-8 -*-

import lib.dataTypes as types
from lib.sqlReport import * 

from maillib.imap import Imap

class FolderTree:
	
	columns = [
		Column({
			'id': "folder_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Název",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'id': "subfolders",
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
			folders = imapHandler.getFolderTree(query['folder_id'])
		else:
			folders = imapHandler.getFolderTree()
		
		imapHandler.close()
		
		return  {
			'data': folders
		}
		
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols
