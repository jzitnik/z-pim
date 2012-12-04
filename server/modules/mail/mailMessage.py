# -*- coding: utf-8 -*-

import lib.dataTypes as types
from lib.sqlReport import * 

from maillib.imap import Imap
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from datasources.postgres import SQLTransaction
import psycopg2

import smtplib

class MailMessage:
	
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
			'id': "html",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.HTML(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'id': "message",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.EmailMessage(),
			'editable': True,
			'insertable': True
		})
	] 
	
	def __init__(self, session):
		self.session = session
	
	def getData(self, query = {}, limit = None):
		
		imapHandler = Imap(self.session['user_id'], query['accountId'])
		
		if not 'folder_id' in query:
			query['folder_id'] = "INBOX"
		
		if query and 'mail_id' in query:
			mails = [imapHandler.getMail(query['mail_id'], query['folder_id'])]
			
		else:
			mails = []
		
		imapHandler.close()
		
		return  {
			'data': mails
		}
		
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols
		
		
	def sendMail(self, accountId, subject, recipients, message):
		
		conn = SQLTransaction()
		cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
		
		cursor.execute("""
			SELECT * FROM pim.smtp_accounts WHERE 
			smtp_account_id = %s AND user_id = %s""", (accountId, self.session['user_id']))
		
		settings = cursor.fetchone()
		
		conn.close()
		
		smtpConn = smtplib.SMTP(settings['host'])
		if settings['login']:
			smtpConn.login(settings['login'], settings['password'])
			
			
		to = ", ".join(recipients)
		
		msg = MIMEMultipart()
		msg.set_charset("UTF-8")
		msg['From'] = settings['name']
		msg['To'] = to
		msg['Subject'] = subject
		
		htmlPart = MIMEText(message.encode("utf8"), 'html')
		
		msg.attach(htmlPart)
			
		smtpConn.sendmail(settings['name'], to, msg.as_string())
		smtpConn.quit()
		
		return {
			'status': "OK"
		}
 
