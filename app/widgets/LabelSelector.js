dojo.provide("app.widgets.LabelSelector");

dojo.require("dijit.form.ComboBox");
dojo.require("app.JsonStore");
dojo.require("dijit.Dialog");

dojo.declare("app.widgets._Label", dijit._Widget, {
	'class': "labelWidget",
	postCreate: function() {
		
		this.label = dojo.create("div", {
			innerHTML: this.name,
			'class': "label"
		});
		dojo.place(this.label, this.domNode);
		
		this.removeButton = new dijit.form.Button({
			label: "",
			'class': "iconButton removeButton",
			iconClass: "delete",
			onClick: dojo.hitch(this, function() {
				this.onRemove(this);
			})
		});
		
		this.removeButton.placeAt(this.domNode);
	},
	
	onRemove: function() {
		
	},
	
	get: function(name) {
		if (name == "value") {
			return this.name;
		}
		return this.inherited(arguments);
	}
})

dojo.declare("app.widgets.LabelSelector", dijit._Widget, {
	
	'class': "labelSelector",
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Labels"
		});
		
		this.autocomplete = new dijit.form.ComboBox({
			searchAttr: "name",
			store: this.store,
			onKeyPress: dojo.hitch(this, function(event) {
				if (event.charOrCode == dojo.keys.ENTER) {
					dojo.stopEvent(event);
					this.add();
					this.autocomplete.focus();
					return false;
				}
			})
		});
		
		this.autocomplete.placeAt(this.domNode);
		
		this.addButton = new dijit.form.Button({
			label: "Přidat",
			onClick: dojo.hitch(this, this.add),
			iconClass: "add",
			'class': "iconButton"
		});
		
		this.addButton.placeAt(this.domNode);
		
		this.labelsArea = new dijit.layout._LayoutWidget();
		this.labelsArea.placeAt(this.domNode);
	},
	
	add: function() {
		var name = this.autocomplete.get("value");
		
		if (this.get("value").indexOf(name) >= 0) {
			return;
		}
		
		this.labelsArea.addChild(new app.widgets._Label({
			name: name,
			onRemove: dojo.hitch(this, function(label) {
				this.labelsArea.removeChild(label);
				label.destroyRecursive();
			})
		}));
		
		this.autocomplete.set("value", null);
		
	},
	
	get: function(name) {
		if (name == "value") {
			var labels = [];
			dojo.forEach(this.labelsArea.getChildren(), function(item) {
				labels.push(item.get("value"));
			});
			return labels;
		}
		return this.inherited(arguments);
	}
});