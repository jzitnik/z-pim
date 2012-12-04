 
dojo.provide("app.widgets.form.DataForm");

dojo.require("app.widgets.form.Field");

dojo.declare("app.widgets.form.DataForm", dijit.layout._LayoutWidget, {
	
	store: null,
	query: null,
	template: null,
	offset: [0, 100],
	sort: null,
	insert: false,
	visibleButtons: ["edit", "delete", "cancelEdit"],
	baseClass: "appDataForm",
	staticData: {},
	
	constuctor: function() {
		this.rows = [];
		this.inherited(arguments);
	},
	
	postCreate: function() {
		this.inherited(arguments);
		
		if (this.store) {
			this.doRequest();
		}
	},
	
	setQuery: function(query) {
		if (this.request) {
			this.request.abort();
		}
		this.destroyDescendants();
		this.query = query;
		this.doRequest();
	},
	
	doRequest: function() {
		var params = {
			query: this.query,
			onBegin: dojo.hitch(this, this.onQueryBegin),
			onComplete: dojo.hitch(this, this.onQueryComplete),
			onError: dojo.hitch(this, this.onQueryError),
			
		}
		
		if (this.offset) {
			params.start = this.offset[0];
			params.count = this.offset[1] - this.offset[0];
		}
		
		params.sort = this.sort;
			
		this.request = this.store.fetch(params);
	},
	
	onQueryBegin: function() {
		console.log("on query begin");
	},
	
	onQueryComplete: function(data) {
		console.log("on query complete", data);
		
		if (data.length > 0 && this.insert == false) {
			this.createNodes(data);
		} else if (this.insert == true) {
			this.insertRow();
		}
		
	},
	
	createNodes: function(data) {
		this.rows = [];
		var pthis = this;
		for (var i in data) {
			var node = new app.widgets.form.Field({
				templateString: this.getTemplate(data[i]),
				data: data[i],
				columns: this.store.getColumns(),
				visibleButtons: this.visibleButtons,
				onStopEditClick: function() {
					//!! FIELD SCOPE!!
					
					var data = this.getData();
					
// 					var item = pthis.store.get
					
					for (var i in data) {
						pthis.store.setValue(data, i, data[i]);
					}
					
					pthis.store.save({
						onComplete: dojo.hitch(this, function(newData) {
							this.stopEdit(data);
						})
					})
				},
				onDeleteClick: function() {
					if (confirm("Opravdu chcete záznam smazat?")) {
						pthis.store.deleteItem(this.data);
						pthis.store.save({
							onComplete: dojo.hitch(this, function() {
								this.destroyRecursive();
							})
						})
					}
				},
				mode: "static",
				onEdited: this.onEdited,
				onCancelEdit: this.onCancelEdit
			});
			
			node._connects.push(dojo.connect(node, "startup", this, function() {
				this.onFieldStartup(node);
			}));
			
			this.addChild(node);
			this.rows.push(node);
		}
	},
	
	onQueryError: function() {
		console.log("on query error");
	},
	
	getTemplate: function(dataRow) {
		return dojo.cache("app", "templates/"+this.store.module+".html");
	},
	
	renderForm: function() {
		
	},
	
	onFieldStartup: function(field) {
		
	},
	
	insertRow: function() {
		var pthis = this;
		
		var visibleButtons = dojo.mixin([], this.visibleButtons);
		var delIndex = visibleButtons.indexOf("delete");
		visibleButtons[delIndex] = null;
		
		
		var row = new app.widgets.form.Field({
			templateString: this.getTemplate(),
			data: {},
			columns: this.store.getColumns(),
			visibleButtons: visibleButtons,
			onStopEditClick: function() {
				//!! FIELD SCOPE !!
				
				var data = this.getData();
				
				pthis.store.newItem(dojo.mixin(data, pthis.staticData));
				
				pthis.store.save({
					onComplete: dojo.hitch(this, function(newData) {
						dojo.mixin(data, newData[0]);
						this.stopEdit(data);
					})
				})
			},
			mode: "insert",
			onEdited: this.onEdited,
			onCancelEdit: this.onCancelEdit
		});
		
		row._connects.push(dojo.connect(row, "startup", this, function() {
			this.onFieldStartup(row);
		}));
		
		this.addChild(row);
	},
	
	startup: function() {
		this.inherited(arguments);
		
		dojo.forEach(this.getChildren(), function(child) {
			child.startup();
		});
		
	},
	
	
	//-------------EVENTS SUMMARY--------------------
	
	
	onEdited: function(newData) {
		
	},
	
	onCancelEdit: function() {
		
	}
	
	
});