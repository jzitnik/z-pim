dojo.provide("app.widgets.FormValueViewer");

dojo.require("dijit._Widget");
dojo.require("dijit.form.CheckBox");

dojo.declare("app.widgets.FormValueViewer", dijit._Widget, {
	postCreate: function() {
		this.inherited(arguments);
	},
	
	set: function(name, value) {
		if (name != "value") {
			return this.inherited(arguments);
		}
		
		this.domNode.innerHTML = value;
	},
	
	get: function(name) {
		if (name != "value") {
			return this.inherited(arguments);
		}
		
		return this.domNode.innerHTML;
	}
});

dojo.declare("app.widgets.FormDateViewer", dijit._Widget, {
	
	set: function(name, value) {
		if (name == "value") {
			this.date = value;
			this.domNode.innerHTML = dojo.date.locale.format(value, {
				fullYear: true
			});
			return value;
		}
		return this.inherited(arguments);
		
	},
	
	get: function(name) {
		if (name == "value") {
			return this.date;
		}
		
		return this.domNode.innerHTML;
	}
	
});


dojo.declare("app.widgets.FormBooelanViewer", dijit.form.CheckBox, {
	disabled: true,
	
	constructor: function(args) {
			
		if (args.value) {
			args.checked = args.value ? "checked" : null;
		}
		this.checked = args.checked;
		
		this.inherited(arguments);
	
	}
});
