# -*- coding: utf-8 -*-
#from __future__ import unicode_literals

import os, sys
import beaker.middleware
import beaker.session

import re
import traceback

sys.path.append(os.path.dirname(__file__))

#monitoring changes
import monitor
monitor.start(interval=5.0)
monitor.track(os.path.dirname(__file__))

from lib.request import Request

from lib.auth import AuthRequest

import lib.errors as errors

from weberror.evalexception import EvalException

#load modules
#import modules.loader
from config.config import Config

#server/modul?request={
#    json...
#}

def parseConfig(env):

	regexp = re.compile(r"^logis\.([a-zA-Z0-9\.]*)$")
	for item in env:

		match = regexp.findall(item)
		if len(match) < 1:
			continue

		arr = match[0].split(".")
		# [1, 2, 3} = 1.2.3
		if not hasattr(Config, arr[0]):
			if len(arr) > 1:
				setattr(Config, arr[0], {})
			else:
				setattr(Config, arr[0], env[item])
				return

		reference = getattr(Global, arr[0])

		for part in arr[1:]:
			if part not in reference:
				reference[part] = {}
				reference = reference[part]

		reference = env[item]


def app(environ, start_response):
	"""
	Function for returh HTTP-AUTH headers

	@type environ: dict
	@param environ: WSGI environ variable
	@type start_response: callable
	@param start_response: WSGI start_response function
	"""
	#database config from apache
	if not Config.configParsed:
		parseConfig(environ)
		Config.configParsed = True
	
	
	session = environ['beaker.session']
	if 'user_id' not in session or not session['user_id']:
		request = AuthRequest(environ)
		result = request.dispatch()
	
	#check again, AuthRequest can authorize user
	if session.has_key('user_id'):
		request = Request(environ)
		result = request.dispatch()
	
	#Response
	#try:
	start_response(result.getStatusCode(), result.getHeaders())
	#finally:
	session.save()
	return result



session_opts = {
	'session.auto': True,
	'session.type': 'file',
	'session.data_dir': '/tmp/beaker/data',
	'session.lock_dir': '/tmp/beaker/lock',
	'session.cookie_expires': True
}

application = beaker.middleware.SessionMiddleware(app, session_opts)



#application = AccumulatingProfileMiddleware(
              #application,
              #log_filename='/home/local/work/jzitnik/lis/py/profiler.log',
              #cachegrind_filename='/home/local/work/jzitnik/lis/py/cachegrind.out.bar',
              #discard_first_request=True,
              #flush_at_shutdown=True,
              #path='/__profile__'
             #)
#application = EvalException(application, global_conf={'debug': True})




