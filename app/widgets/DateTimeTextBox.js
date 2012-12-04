dojo.provide("app.widgets.DateTimeTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TimeTextBox");

dojo.declare("app.widgets.DateTimeTextBox", dijit._Widget, {
	postCreate: function() {
		this.date = new dijit.form.DateTextBox({
			value: new Date()
		});
		this.time = new dijit.form.TimeTextBox({
			value: new Date()
		});
		
		this.date.placeAt(this.domNode);
		this.time.placeAt(this.domNode);
	},
	
	set: function(name, value) {
		if (name == "value") {
// 			return this.inherited(arguments);
			console.log("SET VALUE", value);
			this.date.set("value", new Date(value));
			this.time.set("value", new Date(value));
			
			return value;
		}
		
		return this.inherited(arguments);
	},
	
	get: function(name) {
		if (name == "value") {
			var date = this.date.get("value");
			var time = this.time.get("value");
			
			date.setHours(time.getHours());
			date.setMinutes(time.getMinutes());
			date.setSeconds(time.getSeconds());
			
			return date;
		}
		
		return this.inherited(arguments);
	}
});
