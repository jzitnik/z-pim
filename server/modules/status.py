
from lib.module import Module


class Status(Module):

	def __init__(self):
		pass

	def __default__(self):
		status = {}
		import modules
		status['modules'] =  dir(modules)

		return status

