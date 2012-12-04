#from smtp import Smtp
import email
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import time
from threading import RLock
import os
from PIL import Image
import mimetypes
import StringIO
import hashlib
import smtplib
import re

class Smtp:
	def __init__(self, server, login = None, password = None):
		self.server = server
		self.drafts = {}
		self.lock = RLock()
		self.cidIdentifier = 'linuxbox.cz'
		#self.base_dir = os.path.join('/home/httpd/html/lis/mail', session.id)
		
		self.login = login
		self.password = password
		
		
	def addDraft(self):
		self.lock.acquire()
		draftId = int(time.time())
		
		while (draftId in self.drafts):
			draftId += 1
			
		self.drafts[draftId] = MIMEMultipart()
		self.drafts[draftId].set_charset("UTF-8")
		self.lock.release()
		
		return draftId
	
	def generateCID(self, url):
		return '%s@%s' % (hashlib.md5(url+str(time.time())).hexdigest(), self.cidIdentifier)
		
	def uploadFile(self, draftID, fileitem):
		draftID = int(draftID)
		if draftID not in self.drafts:
			"Draft not found"
					
		if fileitem.filename:
			fn = os.path.basename(fileitem.filename)
			fileInfo = {'name': fn}
			
			fileContent = fileitem.file.read()
			fileInfo['size'] = self.filesize(fileitem.file.tell())
			
			try:
				img = Image.open(StringIO.StringIO(fileContent))
				fileInfo['width'], fileInfo['height'] = img.size
				fileInfo['isImage'] = True
				del img
			except IOError, e:
				fileInfo['isImage'] = False
			
			ctype, encoding = mimetypes.guess_type(fileInfo['name'])
			if ctype is None or encoding is not None:
				ctype = 'application/octet-stream'
		
			maintype, subtype = ctype.split('/', 1)
			if maintype == 'text':
				part = MIMEText(fileContent, _subtype=subtype)
			elif maintype == 'image':
				part = MIMEImage(fileContent, _subtype=subtype)
			elif maintype == 'audio':
				part = MIMEAudio(fileContent, _subtype=subtype)
			else:
				part = MIMEBase(maintype, subtype)
				part.set_payload(fileContent)
				
			#prilozeni souboru k mailu
			fileInfo['id'] = self.generateCID(fileInfo['name'])
			part.add_header('Content-Disposition', 'attachment; filename="%s"' % fileInfo['name'])
			if fileInfo['isImage']:
				part.add_header('Content-ID', '<%s>' % fileInfo['id'])
			
			self.drafts[draftID].attach(part)
			
			obj = fileInfo
			
		else:
			obj = {'ERROR': "not fileitem"}
		
		print "FILE UPLOADED", obj
		
		return obj
			
	def getFile(self, draftID, name):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
			
		#try:
		for part in self.drafts[draftID].walk():
			if part.get_content_maintype() == "multipart":
				continue
			filename = part.get_filename()
			cid = part.get_all('Content-ID')
			if (filename == name) or (cid and cid[0] == "<"+name+">"):
				file_content = part.get_payload(decode=True)
				content_type = part.get_all('Content-type')[0]
				return {'content_type': content_type, 'file':file_content, 'filename': filename}
		
		#except Exception as e:
			#return str(e)
		
		return "file not found"
		
	def getDraftString(self, draftID):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
			
		return self.drafts[draftID].as_string()
			
	
	def setSubject(self, draftID, subject):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
		
		self.drafts[draftID]['Subject'] = subject
		return True

	def addRecipients(self, draftID, recipients):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
		
		if isinstance(recipients, (list, tuple)):
			self.drafts[draftID]['To'] += ', '.join(recipients)
			
		else:
			self.drafts[draftID]['To'] += recipients
			
		return True

	def setRecipients(self, draftID, recipients):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
		
		if isinstance(recipients, (list, tuple)):
			self.drafts[draftID]['To'] = ', '.join(recipients)
			
		else:
			self.drafts[draftID]['To'] = recipients
			
		return True

	def addMessageText(self, draftID, text, mimetype='plain'):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
	
		#nahrazeni <img> na content-id
		#http://localhost:8080/mailserver?action=getFile&draftID=1278672518&filename=678f40c09f4c79fe4de31926eac55bde@linuxbox.cz
		
		#In [33]: re.findall(r'<img\s.*src="([^\s]*draftID=([^\s&amp;]*)[^\s]*).*>', str)
		#Out[33]: 
		#[('mailserver?action=getFile&amp;draftID=1278670698&amp;filename=large6.jpg"',
		#'1278670698')]
		
		#re.findall(r'(<img\s.*src="[^\s]*filename=([^\s"]*)[^\<]*>)', str)

		regexp = r'(<img\s.*src=")([^\s]*filename=([^\s"][a-zA-Z0-9]*@'+re.escape(self.cidIdentifier)+'))([^\<]*>)'
		
		if not text:
			return False
			
		body = MIMEText(re.sub(regexp, r'\1cid:\3\4', text), mimetype)
		
		self.drafts[draftID].attach(body)
		
		return True

	def addPart(self, draftID, mimePart):
		#osetreni content-id
		#mimePart
		cid = re.sub(r'^<(.*)>$', r'\1', mimePart.get_all('Content-ID')[0])
		filename = mimePart.get_filename()
		
		if filename:
			content_id = self.generateCID(filename)
		elif cid:
			content_id = self.generateCID(cid)
		else:
			content_id = self.generateCID("")
		
		try:
			mimePart.replace_header('Content-ID', '<%s>' % content_id)
		except KeyError, e:
			mimePart.add_header('Content-ID', '<%s>' % content_id)
		
		self.drafts[draftID].attach(mimePart)
		
		return content_id

	def send(self, draftID, fromAddr):
		draftID = int(draftID)
		if draftID not in self.drafts:
			return "Draft not found"
			
		try:
			smtpConn = smtplib.SMTP(self.server)
			if self.login and self.password:
				smtpConn.login(self.login, self.password)
				
			smtpConn.sendmail(fromAddr, self.drafts[draftID]['To'], self.drafts[draftID].as_string())
			smtpConn.quit()
			return True
		
		except Exception, e:
			print e
			return False
	
	
	#TODO
	def saveDraft(self, draftID, imapInstance=None):
		return True
		
	def deleteDraft(self, draftID):
		return True
		
	def filesize(self, num):
		for x in ['bytes','KB','MB','GB','TB']:
			if num < 1024.0:
				return "%3.1f %s" % (num, x)
			num /= 1024.0