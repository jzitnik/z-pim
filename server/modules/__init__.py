
import re
import os
import sys
import traceback

#Module folders
reFile = re.compile("^([a-zA-Z]+)$")
for filename in os.listdir(os.path.dirname(__file__)):
	result = reFile.findall(filename)
	print "FIND MODULES", result
	if len(result) > 0:
		for moduleFolder in result:
			try:
				print "IMPORT", moduleFolder
				exec("import %s" % moduleFolder)
			except Exception, e:
				print e
				traceback.print_exc(file=sys.stdout)


#simple modules
reFile = re.compile("^([a-z]{1})([a-zA-Z]+)\.py$")
for filename in os.listdir(os.path.dirname(__file__)):
	result = reFile.findall(filename)
	if len(result) > 0:
		scriptName = result[0][0] + result[0][1]
		className = result[0][0].upper() + result[0][1]
		print "from %s import %s" % (scriptName, className)
		exec("from %s import %s" % (scriptName, className))