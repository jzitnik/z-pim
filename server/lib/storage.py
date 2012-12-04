# -*- coding: utf-8 -*-
import threading

class ThreadStorage:
	threads = {}

	def put(self, name, obj):
		thread_name = threading.currentThread().getName()

		if thread_name not in self.threads:
			self.threads[thread_name] = {}

		self.threads[thread_name][name] = obj

	def get(self, name):
		thread_name = threading.currentThread().getName()

		return self.threads[thread_name][name]


class GlobalStorage:
	pass

class UserStorage:
	pass
