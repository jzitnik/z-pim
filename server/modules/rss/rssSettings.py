# -*- coding: utf-8 -*-

from lib.module import Module

import lib.dataTypes as types
from lib.sqlReport import * 

class RssSettings(Module):
	table = "pim.rss_feeds"
	
	columns = [
		Column({
			'id': "rss_feed_id",
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
			'name': u"URL",
			'id': "rss_url",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.String(),
			'editable': True,
			'insertable': True
		})
		
	]
