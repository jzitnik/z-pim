# -*- coding: utf-8 -*-
import urllib
import json

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from datasources.postgres import SQLTransaction
import psycopg2

import smtplib

class Helper:
	
	sender = "info@pim.zitnik.org"
	admin = "jan@zitnik.org"
	
	def __init__(self, session):
		self.session = session
	
	def send(self, message):
		
		conn = SQLTransaction()
		cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
		
		cursor.execute("SELECT * FROM pim.users WHERE user_id = %s", [self.session['user_id']])
		user = cursor.fetchone()
		conn.close()
		
		smtpConn = smtplib.SMTP("localhost")
		
		msg = MIMEMultipart()
		msg.set_charset("UTF-8")
		msg['From'] = self.sender
		msg['To'] = self.admin
		msg['Subject'] = u"Návrh na zlepšení PIM"
		
		htmlPart = MIMEText(message.encode("utf8"), 'html')
		
		msg.attach(htmlPart)
			
		smtpConn.sendmail("PIM", self.admin, msg.as_string())
		smtpConn.quit()
		
		return {
			"status": "OK"
		}
		
