import os, sys
import re
import email
import email.utils
import imaplib
import StringIO
from PIL import Image
import datetime
from datasources.postgres import SQLTransaction
import psycopg2

from email.header import decode_header

class Imap:
	reFolderParser = re.compile(r"\(([^\"]*)\)\s*\"*([^\"|^\s]*)\"*\s*\"*([^\"]*)\"*")
	
	def __init__(self, userId, accountId):
		
		conn = SQLTransaction()
		cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
		
		cursor.execute("""
			SELECT * FROM pim.imap_accounts WHERE 
			imap_account_id = %s AND user_id = %s""", (accountId, userId))
		
		settings = cursor.fetchone()
		conn.close()
		
		
		if settings['ssl'] == True:
			self.imapHandle = imaplib.IMAP4_SSL(settings['host'], settings['port'])
		else:
			self.imapHandle = imaplib.IMAP4(settings['host'], settings['port'])
			
		if settings['login']:
			self.login(settings['login'], settings['password'])
			
		self.attachments = {}
		
	def login(self, login, password):
		self.login = login
		self.password = password
		
		#self.lock.acquire()
		result = self.imapHandle.login(login, password)
		#self.lock.release()
		
		if(result[0] == "OK"):
			return True
		else:
			return False
	
	def __indexOfAttr(self, treeRef, attr, value):
		for i, val in enumerate(treeRef):
			if treeRef[i][attr] == value:
				return i
				
		return -1
	
	#vypis adresarove struktury
	def getFolderTree(self, folderId = None):
		
		search = "*"
		if folderId:
			search = "%s.*" % folderId
		
		print "PATTERN", search
		status, folders = self.imapHandle.list(pattern=str(search))
		
		if status != 'OK':
			return False
		
		tree = []
		
		for line in folders:
			print "LINE", line
			flags, delimiter, folder = self.reFolderParser.findall(line)[0]
						
			lastRef = tree
			treeArray = folder.split(delimiter)
			solvedItems = []
			for item in treeArray: #separated items by delimiter
				solvedItems.append(item)
				
				index = self.__indexOfAttr(lastRef, 'name', item)
				if index < 0:
					new = {
						'name': item,
						'folders': [],
						'folder_id': delimiter.join(solvedItems)
					}
					lastRef.append(new)
					index = self.__indexOfAttr(lastRef, 'name', item)
					
				lastRef = lastRef[index]['folders']
				
		
		return tree
		

	##vypis emailu z urciteho adresare
	def getMailList(self, directory = None, searchParams = None):
		print "DIR", directory
		print "SEARCH", searchParams
		messages = []
		
		search = '(ALL)'
		if searchParams:
			search = []
			for item in searchParams:
				#if not
				search.append(item + ' "' + searchParams[item] + '"')
			
			search = "(" + ' '.join(search) + ")"
			
		
		if not directory:
			directory = "INBOX"
			
		
			
		result = self.imapHandle.select(str(directory))
		
		status, data = self.imapHandle.search(None, search)
		for num in data[0].split():
			status, data = self.imapHandle.fetch(num, '(BODY[HEADER.FIELDS (SUBJECT FROM DATE CONTENT-TYPE MESSAGE-ID)])')
			if status == 'OK':
				msg = email.message_from_string(data[0][1])
				charset = msg.get_content_charset()
				try:
					if charset:
						subject =  unicode(decode_header(msg.get_all('Subject')[0])[0][0], charset, "replace")
					else:
						subject = decode_header(msg.get_all('Subject')[0])[0][0]
				except TypeError,e :
					subject = ""
				
				try:
					sender = msg.get_all('From')[0]
				except TypeError,e :
					sender = ""
				
				dateTuple = email.utils.parsedate_tz(msg.get_all('Date')[0])
				date = datetime.datetime.fromtimestamp(email.utils.mktime_tz(dateTuple))
				
				messages.append({
					'mail_id': msg.get('Message-ID'),
					'folder': str(directory),
					'subject': subject,
					'sender': sender,
					'date': date,
					'folder': directory
				})

		#self.lock.release()
		return messages
		
	##vrati pole ['text'] ['html'] s emailem, bez priloh
	def getMail(self, mailId, folder="INBOX"):
		#self.attachments = {}
		#self.lock.acquire()
		
		self.imapHandle.select(folder)
		print "SELECTING FOLDER", folder
			
			
		status, data = self.imapHandle.search(None, 'HEADER', 'Message-ID', mailId)
		print "STATUS", status, data
			
		status, data = self.imapHandle.fetch(data[0], '(RFC822)')
		##print data[0][1]
		msg = email.message_from_string(data[0][1])
		charset = msg.get_content_charset()
		message = {}
		
		message['attachments'] = []
		
		#prochazeni jednotlivych casti mailu
		message['message'] = []
		for part in msg.walk():
			if part.get_content_maintype() == "multipart":
				continue
			
			if 'Content_type' not in message:
				if part.get_all('Content-type'):
					message['content_type'] = part.get_all('Content-type')[0]
			
			filename = part.get_filename()
			content_type = part.get_content_type()
			
			if filename:
				cid = part.get_all('Content-ID')
				file_content = part.get_payload(decode=True)
				
				if(file_content):
					pass
					
				continue
				
			if charset:
				payload = unicode(part.get_payload(decode=True), charset, "replace")
			else:
				payload = part.get_payload(decode=True)
				
			
			message['message'].append({
				'contentType': content_type,
				'content': payload
			})
			
			
			
		if charset:
			message['subject'] =  unicode(decode_header(msg.get_all('Subject')[0])[0][0], charset, "replace")
		else:
			message['subject'] = decode_header(msg.get_all('Subject')[0])[0][0]
		message['sender'] = msg.get_all('From')[0]
		
		dateTuple = email.utils.parsedate_tz(msg.get_all('Date')[0])
		message['date'] = datetime.datetime.fromtimestamp(email.utils.mktime_tz(dateTuple))
		
		return message
		
	def close(self):
		try:
			self.imapHandle.close()
		except Exception, e:
			print e
		
		self.imapHandle.logout()

