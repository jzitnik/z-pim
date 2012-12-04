# -*- coding: utf-8 -*-

from lib.module import Module

import lib.dataTypes as types
from lib.sqlReport import * 
import pprint
import feedparser
import psycopg2

class Feed:
	
	columns = [
		Column({
			'name': "Titulek",
			'id': "title",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.String(),
		}),
		Column({
			'name': "Odkaz",
			'id': "link",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.String(),
		}),
		Column({
			'name': "Text",
			'id': "description",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.HTML(),
		}),
		Column({
			'name': "Datum",
			'id': "date",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Date(),
		})
	]
	
	def __init__(self, session):
		self.session = session
	
	def __default__(self):
		return ""
	
	def getColumns(self):
		cols = {}
		for col in self.columns:
			colId = col.getId()
			cols[colId] = col.getInfo()
			
		return cols
	
	def getData(self, query):
		
		rows = []
		qry = "SELECT * FROM pim.rss_feeds WHERE user_id = %s"
		args = [self.session['user_id']]
		
		feedId = None
		
		if 'feed_id' in query:
			qry += " AND rss_feed_id = %s"
			args = [self.session['user_id'], query['feed_id']]
		
		print "QRY", qry, "ARGS:", args
		
		conn = Service.getDbConn()
		
		cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
		cursor.execute(qry, args)
		
		for feed in cursor.fetchall():
			rows += self.getFeedFromURL(feed['rss_url'])
			
			
		Service.putDbConn(conn)
		
		#print feed
		pp = pprint.PrettyPrinter(indent=4)
		pp.pprint(feed)
		return {
			'data': rows,
			'columns': self.getColumns()
		}
		
	
	def getFeedFromURL(self, url):
		rows = []
		feed = feedparser.parse(url)
		
		for entry in feed['entries']:
			rows.append({
				'title': entry['title'],
				'link': entry['link'],
				'description': entry['summary'],
				'date': entry['updated'],
			})
			
		return rows
