# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Tasks(Module):
	table = "pim.tasks"
	columns = [
		Column({
			'id': "object_id",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit", "static"],
			'required': False,
			'type': types.Integer(),
			'flags': ["primaryKey"]
		}),
		Column({
			'name': u"Štítky",
			'id': "labels",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["edit"],
			'required': True,
			'type': types.Label()
		}),
		Column({
			'name': u"Vytvořeno",
			'id': "created",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static"],
			'required': False,
			'type': types.Date()
		}),
		Column({
			'name': u"Úkol",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Dokončeno",
			'id': "finished",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': False,
			'type': types.Boolean(),
			'editable': True,
			'insertable': True
		})
	]
	
	
	
