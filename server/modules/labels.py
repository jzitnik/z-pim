# -*- coding: utf-8 -*-

from lib.module import Module
from lib.cache import *

import lib.dataTypes as types
from lib.sqlReport import *
import datasources.postgres

class Labels(Module):
	table = "pim.labels"
	columns = [
		Column({
			'name': u"Název",
			'id': "name",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True,
			'flags': ['primaryKey']
		}),
		Column({
			'name': u"Popis",
			'id': "description",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.String(),
			'editable': True,
			'insertable': True
		}),
		Column({
			'name': u"Barva",
			'id': "color",
			#'validator': RegexpValidator("^[0-9]$"),
			'visibility': ["static", "edit"],
			'required': True,
			'type': types.Color(),
			'editable': True,
			'insertable': True
		})
	]
	
	
	
	

	
