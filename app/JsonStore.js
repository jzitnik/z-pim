dojo.provide("app.JsonStore");

dojo.require("dojo.data.api.Read");
dojo.require("dojo.data.api.Write");
dojo.require("app.Types");

dojo.declare("app.JsonStore", [dojo.data.api.Read, dojo.data.api.Write], {
	
	module: "",
	baseUrl: "/server",
	
	constructor: function(args) {
		this.columns = null;
		this.newItems = [];
		this.changes = [];
		this.changedItems = [];
		this.deletedItems = [];
		
		dojo.mixin(this, args);
	},
	
	getValue: function(item, attribute, defaultValue) {
		if(!this.hasAttribute(item, attribute)){
			// read api says: return defaultValue "only if *item* does not have a value for *attribute*."
			// Is this the case here? The attribute doesn't exist, but a defaultValue, sounds reasonable.
			if(defaultValue){
				return defaultValue;
			}
		}
		return item[attribute];
	},

	getValues: function(/* item */ item,
			/* attribute-name-string */ attribute){
		//	summary:
		// 		This getValues() method works just like the getValue() method, but getValues()
		//		always returns an array rather than a single attribute value.  The array
		//		may be empty, may contain a single attribute value, or may contain
		//		many attribute values.
		//		If the item does not have a value for the given attribute, then getValues()
		//		will return an empty array: [].  (So, if store.hasAttribute(item, attribute)
		//		has a return of false, then store.getValues(item, attribute) will return [].)
		//
		//	item:
		//		The item to access values on.
		//	attribute:
		//		The attribute to access represented as a string.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		//	example:
		//	|	var friendsOfLuke = store.getValues(lukeSkywalker, "friends");
		var array = [];
		throw new Error('Unimplemented API: dojo.data.api.Read.getValues');
		return array; // an array that may contain literals and items
	},

	getAttributes: function(/* item */ item){
		//	summary:
		//		Returns an array with all the attributes that this item has.  This
		//		method will always return an array; if the item has no attributes
		//		at all, getAttributes() will return an empty array: [].
		//
		//	item:
		//		The item to access attributes on.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		//	example:
		//	|	var array = store.getAttributes(kermit);
		var array = [];
		throw new Error('Unimplemented API: dojo.data.api.Read.getAttributes');
		return array; // array
	},

	hasAttribute: function(/* item */ item,	/* attribute-name-string */ attribute) {
		//	summary:
		//		See dojo.data.api.Read.hasAttribute()
		return (this.isItem(item) && typeof item[attribute]!="undefined");
	},

	containsValue: function(/* item */ item,
				/* attribute-name-string */ attribute,
				/* anything */ value){
		//	summary:
		//		Returns true if the given *value* is one of the values that getValues()
		//		would return.
		//
		//	item:
		//		The item to access values on.
		//	attribute:
		//		The attribute to access represented as a string.
		//	value:
		//		The value to match as a value for the attribute.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		//	example:
		//	|	var trueOrFalse = store.containsValue(kermit, "color", "green");
		throw new Error('Unimplemented API: dojo.data.api.Read.containsValue');
		return false; // boolean
	},

	isItem: function(/* anything */ something) {
		if(something) {
			return true;
		}
		return false;
	},

	isItemLoaded: function(/* anything */ something) {
		//	summary:
		//		Returns false if isItem(something) is false.  Returns false if
		//		if isItem(something) is true but the the item is not yet loaded
		//		in local memory (for example, if the item has not yet been read
		//		from the server).
		//
		//	something:
		//		Can be anything.
		//
		//	example:
		//	|	var yes = store.isItemLoaded(store.newItem());
		//	|	var no  = store.isItemLoaded("green");
		console.log("IS ITEM LOADED?", something);
		
		var index = this._findItemByPK(something);
		
		if (index >= 0) {
			return true;
		}
		
		//throw new Error('Unimplemented API: dojo.data.api.Read.isItemLoaded');
		return false; // boolean
	},
	
	_findItemByPK: function(item) {
		if (!this.primaryKey) {
			return -1;
		}
		for (var i in this._items) {
			if (this._items[i][this.primaryKey.id] == item[this.primaryKey.id]) {
				return i;
			}
		}
		return -1;
	},
	
	loadItem: function(/* object */ keywordArgs){
		//	summary:
		//		Given an item, this method loads the item so that a subsequent call
		//		to store.isItemLoaded(item) will return true.  If a call to
		//		isItemLoaded() returns true before loadItem() is even called,
		//		then loadItem() need not do any work at all and will not even invoke
		//		the callback handlers.  So, before invoking this method, check that
		//		the item has not already been loaded.
		// 	keywordArgs:
		//		An anonymous object that defines the item to load and callbacks to invoke when the
		//		load has completed.  The format of the object is as follows:
		//		{
		//			item: object,
		//			onItem: Function,
		//			onError: Function,
		//			scope: object
		//		}
		//	The *item* parameter.
		//		The item parameter is an object that represents the item in question that should be
		//		contained by the store.  This attribute is required.
		
		//	The *onItem* parameter.
		//		Function(item)
		//		The onItem parameter is the callback to invoke when the item has been loaded.  It takes only one
		//		parameter, the fully loaded item.
		//
		//	The *onError* parameter.
		//		Function(error)
		//		The onError parameter is the callback to invoke when the item load encountered an error.  It takes only one
		//		parameter, the error object
		//
		//	The *scope* parameter.
		//		If a scope object is provided, all of the callback functions (onItem,
		//		onError, etc) will be invoked in the context of the scope object.
		//		In the body of the callback function, the value of the "this"
		//		keyword will be the scope object.   If no scope object is provided,
		//		the callback functions will be called in the context of dojo.global().
		//		For example, onItem.call(scope, item, request) vs.
		//		onItem.call(dojo.global(), item, request)
		if(!this.isItemLoaded(keywordArgs.item)){
			//throw new Error('Unimplemented API: dojo.data.api.Read.loadItem');
			
			this._fetchItems({
				query: {
					root_id: keywordArgs.item[this.primaryKey]
				},
				onItem: keywordArgs.onItem
			}, function() {}, function() {});
			
		} else {
			var index = this._findItemByPK(keywordArgs.item[this.primaryKey]);
			
			keywordArgs.onItem(this._items[index].childs);
		}
	},
	
	
	fetch: function(/* Object */ request){
		console.log("keywordArgs", request);
		
		// {
		// 	query: query-object or query-string,
		// 	queryOptions: object,
		// 	onBegin: Function,
		// 	onItem: Function,
		// 	onComplete: Function,
		// 	onError: Function,
		// 	scope: object,
		// 	start: int
		// 	count: int
		// 	sort: array
		// }
		
		if(!request.store){
			request.store = this;
		}

		var _errorHandler = function(errorData, requestObject){
			if(requestObject.onError){
				var scope = requestObject.scope || dojo.global;
				requestObject.onError.call(scope, errorData, requestObject);
			}
		};

		var _fetchHandler = function(items, requestObject, numRows){
			var oldAbortFunction = requestObject.abort || null;
			var aborted = false;

			var startIndex = requestObject.start?requestObject.start:0;
			if(self.doClientPaging == false){
				// For client paging we dont need no slicing of the result.
				startIndex = 0;
			}
			var endIndex = requestObject.count?(startIndex + requestObject.count):items.length;

			requestObject.abort = function(){
				aborted = true;
				if(oldAbortFunction){
					oldAbortFunction.call(requestObject);
				}
			};

			var scope = requestObject.scope || dojo.global;
			if(!requestObject.store){
				requestObject.store = self;
			}
			if(requestObject.onBegin){
				requestObject.onBegin.call(scope, numRows, requestObject);
			}
			if(requestObject.sort && self.doClientSorting){
				items.sort(dojo.data.util.sorter.createSortFunction(requestObject.sort, self));
			}
			if(requestObject.onItem){
				for(var i = startIndex; (i < items.length) && (i < endIndex); ++i){
					var item = items[i];
					if(!aborted){
						requestObject.onItem.call(scope, item, requestObject);
					}
				}
			}
			if(requestObject.onComplete && !aborted){
				var subset = null;
				if(!requestObject.onItem){
					subset = items.slice(startIndex, endIndex);
				}
				requestObject.onComplete.call(scope, subset, requestObject);
			}
		};
		
		if (!this.columns && request.query && request.query != {}) {
			dojo.xhrPost({
				url: this.baseUrl + "/" + this.module + "/getColumns",
				handleAs: "json",
				load: dojo.hitch(this, function(data) {
					
					this.processColumns(data);
					
					this._fetchItems(request, _fetchHandler, _errorHandler);
				})
			})
		} else {
			this._fetchItems(request, _fetchHandler, _errorHandler);
		}
		
		return request;
	},
	
	_fetchItems: function(request, fetchHandler, errorHandler) {
	
		if (request.onBegin instanceof Function) {
// 			request.onBegin();
		}
		
// 		var sendQuery = {}
// 		for (var i in request.query) {
// 			if (request.query[i] != "*") {
// 				sendQuery[i] = request.query[i];
// 			}
// 			
// 		}
// 		for (var i in request.query) {
			if (request.query instanceof Array) {
				for (var i in request.query) {
					request.query[i] = this.encodeRow(request.query[i]);
				}
			} else {
				request.query = this.encodeRow(request.query);
			}
// 		}
		
		var xhrHandler = dojo.xhrPost({
			url: this.baseUrl + "/" + this.module + "/getData",
			postData: "request=" + encodeURI(dojo.toJson({
				offset: 0,
				limit: 100,
				query: request.query,
				order: this.order
			})),
			handleAs: "json"
		});

		request.abort = function(){
			xhrHandler.cancel();
		};
		xhrHandler.addCallback(dojo.hitch(this, function(data){
			this._xhrFetchHandler(data, request, fetchHandler, errorHandler);
		}));
		xhrHandler.addErrback(function(error){
			errorHandler(error, request);
		});
	},
	
	encodeRow: function(obj) {
		for (var col in obj) {
			if (col in this.columns && this.columns[col].type in app.Types && app.Types[this.columns[col].type].encode instanceof Function) {
				obj[col] = app.Types[this.columns[col].type].encode(obj[col]);
			}
		}
		return obj;
	},
	
	decodeRow: function(obj) {
		for (var col in obj) {
			if (col in this.columns && this.columns[col].type in app.Types && app.Types[this.columns[col].type].decode instanceof Function) {
				obj[col] = app.Types[this.columns[col].type].decode(obj[col]);
			}
		}
		return obj;
	},
	
	_xhrFetchHandler: function(data, request, fetchHandler, errorHandler){
		console.log("FETCHE D", data);
		
		if (!this.columns) {
			this.processColumns(data.columns);
		}
		
		var numRows = data.data.length;
		
		for (var i in data.data) {
			data.data[i] = this.decodeRow(data.data[i]);
		}
		
		this._items = data.data;
		
		fetchHandler(this._items, request, numRows);
		this._numRows = numRows;
	},
	
	getColumns: function() {
		return this.columns;
	},
	
	processColumns: function(columns) {
		this.columns = columns;
		console.log("COLUMNS", columns);
		
		for (var i in columns) {
			var col = columns[i];
			
			if (col.flags && col.flags.indexOf("primaryKey") >= 0) {
				this.primaryKey = col;
			}
		}
		
		return columns;
	},
	
	getFeatures: function(){
		//	summary:
		//		The getFeatures() method returns an simple keyword values object
		//		that specifies what interface features the datastore implements.
		//		A simple CsvStore may be read-only, and the only feature it
		//		implements will be the 'dojo.data.api.Read' interface, so the
		//		getFeatures() method will return an object like this one:
		//		{'dojo.data.api.Read': true}.
		//		A more sophisticated datastore might implement a variety of
		//		interface features, like 'dojo.data.api.Read', 'dojo.data.api.Write',
		//		'dojo.data.api.Identity', and 'dojo.data.api.Attribution'.
		return {
			'dojo.data.api.Read': true
		};
	},
	
	getIdentity: function(/* item */ item){
		//	summary:
		//		Returns a unique identifier for an item.  The return value will be
		//		either a string or something that has a toString() method (such as,
		//		for example, a dojox.uuid.Uuid object).
		//	item:
		//		The item from the store from which to obtain its identifier.
		//	exceptions:
		//		Conforming implementations may throw an exception or return null if
		//		item is not an item.
		//	example:
		//	|	var itemId = store.getIdentity(kermit);
		//	|	assert(kermit === store.findByIdentity(store.getIdentity(kermit)));
		return item[this.primaryKey.id];
// 		throw new Error('Unimplemented API: dojo.data.api.Identity.getIdentity');
	},
	
	getIdentityAttributes: function(/* item */ item){
		//	summary:
		//		Returns an array of attribute names that are used to generate the identity.
		//		For most stores, this is a single attribute, but for some complex stores
		//		such as RDB backed stores that use compound (multi-attribute) identifiers
		//		it can be more than one.  If the identity is not composed of attributes
		//		on the item, it will return null.  This function is intended to identify
		//		the attributes that comprise the identity so that so that during a render
		//		of all attributes, the UI can hide the the identity information if it
		//		chooses.
		//	item:
		//		The item from the store from which to obtain the array of public attributes that
		//		compose the identifier, if any.
		//	example:
		//	|	var itemId = store.getIdentity(kermit);
		//	|	var identifiers = store.getIdentityAttributes(itemId);
		//	|	assert(typeof identifiers === "array" || identifiers === null);
		throw new Error('Unimplemented API: dojo.data.api.Identity.getIdentityAttributes');
	},
	
	
	fetchItemByIdentity: function(/* object */ keywordArgs){
		//	summary:
		//		Given the identity of an item, this method returns the item that has
		//		that identity through the onItem callback.  Conforming implementations
		//		should return null if there is no item with the given identity.
		//		Implementations of fetchItemByIdentity() may sometimes return an item
		//		from a local cache and may sometimes fetch an item from a remote server,
		//
		// 	keywordArgs:
		//		An anonymous object that defines the item to locate and callbacks to invoke when the
		//		item has been located and load has completed.  The format of the object is as follows:
		//		{
		//			identity: string|object,
		//			onItem: Function,
		//			onError: Function,
		//			scope: object
		//		}
		//	The *identity* parameter.
		//		The identity parameter is the identity of the item you wish to locate and load
		//		This attribute is required.  It should be a string or an object that toString()
		//		can be called on.
		//
		//	The *onItem* parameter.
		//		Function(item)
		//		The onItem parameter is the callback to invoke when the item has been loaded.  It takes only one
		//		parameter, the item located, or null if none found.
		//
		//	The *onError* parameter.
		//		Function(error)
		//		The onError parameter is the callback to invoke when the item load encountered an error.  It takes only one
		//		parameter, the error object
		//
		//	The *scope* parameter.
		//		If a scope object is provided, all of the callback functions (onItem,
		//		onError, etc) will be invoked in the context of the scope object.
		//		In the body of the callback function, the value of the "this"
		//		keyword will be the scope object.   If no scope object is provided,
		//		the callback functions will be called in the context of dojo.global.
		//		For example, onItem.call(scope, item, request) vs.
		//		onItem.call(dojo.global, item, request)
// 		if(!this.isItemLoaded(keywordArgs.item)){
// 			throw new Error('Unimplemented API: dojo.data.api.Identity.fetchItemByIdentity');
// 		}

		// 		{
		//			identity: string|object,
		//			onItem: Function,
		//			onError: Function,
		//			scope: object
		//		}
		
		//search in fetched items
		
		var found = false;
		for (var i in this._items) {
			if (this._items[i][this.primaryKey.id] == keywordArgs.identity) {
				keywordArgs.onItem(this._items[i]);
				found = true;
			}
		}
		
		if (!found) {
			//TODO! fetch item from server
			keywordArgs.onError({
				error: "notFound"
			});
		}
	},

	
	
	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
		//	summary:
		//		The close() method is intended for instructing the store to 'close' out
		//		any information associated with a particular request.
		//
		//	description:
		//		The close() method is intended for instructing the store to 'close' out
		//		any information associated with a particular request.  In general, this API
		//		expects to recieve as a parameter a request object returned from a fetch.
		//		It will then close out anything associated with that request, such as
		//		clearing any internal datastore caches and closing any 'open' connections.
		//		For some store implementations, this call may be a no-op.
		//
		//	request:
		//		An instance of a request for the store to use to identify what to close out.
		//		If no request is passed, then the store should clear all internal caches (if any)
		//		and close out all 'open' connections.  It does not render the store unusable from
		//		there on, it merely cleans out any current data and resets the store to initial
		//		state.
		//
		//	example:
		//	|	var request = store.fetch({onComplete: doSomething});
		//	|	...
		//	|	store.close(request);
		throw new Error('Unimplemented API: dojo.data.api.Read.close');
	},

	getLabel: function(/* item */ item){
		//	summary:
		//		Method to inspect the item and return a user-readable 'label' for the item
		//		that provides a general/adequate description of what the item is.
		//
		//	description:
		//		Method to inspect the item and return a user-readable 'label' for the item
		//		that provides a general/adequate description of what the item is.  In general
		//		most labels will be a specific attribute value or collection of the attribute
		//		values that combine to label the item in some manner.  For example for an item
		//		that represents a person it may return the label as:  "firstname lastlame" where
		//		the firstname and lastname are attributes on the item.  If the store is unable
		//		to determine an adequate human readable label, it should return undefined.  Users that wish
		//		to customize how a store instance labels items should replace the getLabel() function on
		//		their instance of the store, or extend the store and replace the function in
		//		the extension class.
		//
		//	item:
		//		The item to return the label for.
		//
		//	returns:
		//		A user-readable string representing the item or undefined if no user-readable label can
		//		be generated.
// 		throw new Error('Unimplemented API: dojo.data.api.Read.getLabel');
		return item.name
	},

	getLabelAttributes: function(/* item */ item){
		//	summary:
		//		Method to inspect the item and return an array of what attributes of the item were used
		//		to generate its label, if any.
		//
		//	description:
		//		Method to inspect the item and return an array of what attributes of the item were used
		//		to generate its label, if any.  This function is to assist UI developers in knowing what
		//		attributes can be ignored out of the attributes an item has when displaying it, in cases
		//		where the UI is using the label as an overall identifer should they wish to hide
		//		redundant information.
		//
		//	item:
		//		The item to return the list of label attributes for.
		//
		//	returns:
		//		An array of attribute names that were used to generate the label, or null if public attributes
		//		were not used to generate the label.
		throw new Error('Unimplemented API: dojo.data.api.Read.getLabelAttributes');
		return null;
	},

	//	summary:
	//		This is an abstract API that data provider implementations conform to.
	//		This file defines function signatures and intentionally leaves all the
	//		functionss unimplemented.

	getFeatures: function(){
		//	summary:
		//		See dojo.data.api.Read.getFeatures()
		return {
			'dojo.data.api.Read': true,
			'dojo.data.api.Write': true,
			'dojo.data.api.Identity': true,
		};
	},

	newItem: function(/* Object? */ keywordArgs, /*Object?*/ parentInfo){
		//	summary:
		//		Returns a newly created item.  Sets the attributes of the new
		//		item based on the *keywordArgs* provided.  In general, the attribute
		//		names in the keywords become the attributes in the new item and as for
		//		the attribute values in keywordArgs, they become the values of the attributes
		//		in the new item.  In addition, for stores that support hierarchical item
		//		creation, an optional second parameter is accepted that defines what item is the parent
		//		of the new item and what attribute of that item should the new item be assigned to.
		//		In general, this will assume that the attribute targetted is multi-valued and a new item
		//		is appended onto the list of values for that attribute.
		//
		//	keywordArgs:
		//		A javascript object defining the initial content of the item as a set of JavaScript 'property name: value' pairs.
		//	parentInfo:
		//		An optional javascript object defining what item is the parent of this item (in a hierarchical store.  Not all stores do hierarchical items),
		//		and what attribute of that parent to assign the new item to.  If this is present, and the attribute specified
		//		is a multi-valued attribute, it will append this item into the array of values for that attribute.  The structure
		//		of the object is as follows:
		//		{
		//			parent: someItem,
		//			attribute: "attribute-name-string"
		//		}
		//
		//	exceptions:
		//		Throws an exception if *keywordArgs* is a string or a number or
		//		anything other than a simple anonymous object.
		//		Throws an exception if the item in parentInfo is not an item from the store
		//		or if the attribute isn't an attribute name string.
		//	example:
		//	|	var kermit = store.newItem({name: "Kermit", color:[blue, green]});

// 		var newItem = 
// 		throw new Error('Unimplemented API: dojo.data.api.Write.newItem');
		
		this.newItems.push(keywordArgs);
		
		return keywordArgs; // item
	},

	deleteItem: function(/* item */ item){
		//	summary:
		//		Deletes an item from the store.
		//
		//	item:
		//		The item to delete.
		//
		//	exceptions:
		//		Throws an exception if the argument *item* is not an item
		//		(if store.isItem(item) returns false).
		//	example:
		//	|	var success = store.deleteItem(kermit);
		
		this.deletedItems.push(item);
		
		return true;
	},
	
	setValue: function(	/* item */ item,
						/* string */ attribute,
						/* almost anything */ value){
		//	summary:
		//		Sets the value of an attribute on an item.
		//		Replaces any previous value or values.
		//
		//	item:
		//		The item to modify.
		//	attribute:
		//		The attribute of the item to change represented as a string name.
		//	value:
		//		The value to assign to the item.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or if *attribute*
		//		is neither an attribute object or a string.
		//		Throws an exception if *value* is undefined.
		//	example:
		//	|	var success = store.set(kermit, "color", "green");
		
		var update = {}
		update[attribute] = value;
		
		var index = this.changedItems.indexOf(item);
		
		if (index < 0) {
			this.changedItems.push(dojo.mixin(item, update));
		} else {
			this.changedItems[index] = dojo.mixin(item, update);
		}
	
		
// 		throw new Error('Unimplemented API: dojo.data.api.Write.setValue');
		return true; // boolean
	},

	setValues: function(/* item */ item,
						/* string */ attribute,
						/* array */ values){
		//	summary:
		//		Adds each value in the *values* array as a value of the given
		//		attribute on the given item.
		//		Replaces any previous value or values.
		//		Calling store.setValues(x, y, []) (with *values* as an empty array) has
		//		the same effect as calling store.unsetAttribute(x, y).
		//
		//	item:
		//		The item to modify.
		//	attribute:
		//		The attribute of the item to change represented as a string name.
		//	values:
		//		An array of values to assign to the attribute..
		//
		//	exceptions:
		//		Throws an exception if *values* is not an array, if *item* is not an
		//		item, or if *attribute* is neither an attribute object or a string.
		//	example:
		//	|	var success = store.setValues(kermit, "color", ["green", "aqua"]);
		//	|	success = store.setValues(kermit, "color", []);
		//	|	if (success) {assert(!store.hasAttribute(kermit, "color"));}
		
		
// 		
		
// 		throw new Error('Unimplemented API: dojo.data.api.Write.setValues');
		return false; // boolean
	},

	unsetAttribute: function(	/* item */ item,
								/* string */ attribute){
		//	summary:
		//		Deletes all the values of an attribute on an item.
		//
		//	item:
		//		The item to modify.
		//	attribute:
		//		The attribute of the item to unset represented as a string.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or if *attribute*
		//		is neither an attribute object or a string.
		//	example:
		//	|	var success = store.unsetAttribute(kermit, "color");
		//	|	if (success) {assert(!store.hasAttribute(kermit, "color"));}
		throw new Error('Unimplemented API: dojo.data.api.Write.clear');
		return false; // boolean
	},

	save: function(/* object */ keywordArgs){
		//	summary:
		//		Saves to the server all the changes that have been made locally.
		//		The save operation may take some time and is generally performed
		//		in an asynchronous fashion.  The outcome of the save action is
		//		is passed into the set of supported callbacks for the save.
		//
		//	keywordArgs:
		//		{
		//			onComplete: function
		//			onError: function
		//			scope: object
		//		}
		//
		//	The *onComplete* parameter.
		//		function();
		//
		//		If an onComplete callback function is provided, the callback function
		//		will be called just once, after the save has completed.  No parameters
		//		are generally passed to the onComplete.
		//
		//	The *onError* parameter.
		//		function(errorData);
		//
		//		If an onError callback function is provided, the callback function
		//		will be called if there is any sort of error while attempting to
		//		execute the save.  The onError function will be based one parameter, the
		//		error.
		//
		//	The *scope* parameter.
		//		If a scope object is provided, all of the callback function (
		//		onComplete, onError, etc) will be invoked in the context of the scope
		//		object.  In the body of the callback function, the value of the "this"
		//		keyword will be the scope object.   If no scope object is provided,
		//		the callback functions will be called in the context of dojo.global.
		//		For example, onComplete.call(scope) vs.
		//		onComplete.call(dojo.global)
		//
		//	returns:
		//		Nothing.  Since the saves are generally asynchronous, there is
		//		no need to return anything.  All results are passed via callbacks.
		//	example:
		//	|	store.save({onComplete: onSave});
		//	|	store.save({scope: fooObj, onComplete: onSave, onError: saveFailed});
		//throw new Error('Unimplemented API: dojo.data.api.Write.save');
		
		if (this.newItems.length > 0) {
			var xhrHandler = dojo.xhrPost({
				url: this.baseUrl + "/" + this.module + "/insert",
				postData: "request=" + encodeURI(dojo.toJson({
					data: this.newItems,
					
				})).replace(/&/g,'%26').replace(/;/g,'%3B').replace(/\+/g,'%2B'),
				handleAs: "json"
			});
		}
		
		if (this.changedItems.length > 0) {
			for (var i in this.changedItems) {
				
				var key = {}
				key[this.primaryKey.id] = this.changedItems[i][this.primaryKey.id];
				
				var xhrHandler = dojo.xhrPost({
					url: this.baseUrl + "/" + this.module + "/update",
					postData: "request=" + encodeURI(dojo.toJson({
						key: key,
						data: this.changedItems[i],
					})).replace(/&/g,'%26').replace(/;/g,'%3B').replace(/\+/g,'%2B'),
					handleAs: "json"
				});
			}
		}
		
		if (this.deletedItems.length > 0) {
			for (var i in this.deletedItems) {
				
				var key = {}
				key[this.primaryKey.id] = this.deletedItems[i][this.primaryKey.id];
				
				var xhrHandler = dojo.xhrPost({
					url: this.baseUrl + "/" + this.module + "/delete",
					postData: "request=" + encodeURI(dojo.toJson({
						key: key,
// 						data: this.changedItems[i],
					})).replace(/&/g,'%26').replace(/;/g,'%3B').replace(/\+/g,'%2B'),
					handleAs: "json"
				});
			}
		}
		
		xhrHandler.addCallback(dojo.hitch(this, function(data){
			this.newItems = [];
			this.changedItems = [];
		}));
		
		xhrHandler.addErrback(dojo.hitch(this, function() {
			this.newItems = [];
			this.changedItems = [];
		}));
		
		xhrHandler.addCallback(keywordArgs.onComplete);
		xhrHandler.addErrback(keywordArgs.onError);
		
		
// 		}
		
	},

	revert: function(){
		//	summary:
		//		Discards any unsaved changes.
		//	description:
		//		Discards any unsaved changes.
		//
		//	example:
		//	|	var success = store.revert();
		
		this.deletedItems = this.changedItems = this.newItems = [];
		
		return true;
	},

	isDirty: function(/* item? */ item){
		//	summary:
		//		Given an item, isDirty() returns true if the item has been modified
		//		since the last save().  If isDirty() is called with no *item* argument,
		//		then this function returns true if any item has been modified since
		//		the last save().
		//
		//	item:
		//		The item to check.
		//
		//	exceptions:
		//		Throws an exception if isDirty() is passed an argument and the
		//		argument is not an item.
		//	example:
		//	|	var trueOrFalse = store.isDirty(kermit); // true if kermit is dirty
		//	|	var trueOrFalse = store.isDirty();       // true if any item is dirty
		throw new Error('Unimplemented API: dojo.data.api.Write.isDirty');
		return false; // boolean
	},
	
});
