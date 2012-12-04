dojo.provide("app.widgets.Color");
dojo.require("dojox.widget.ColorPicker");
dojo.require("dijit._Widget");

dojo.declare("app.widgets.ColorEditor", dijit._Widget, {
	baseClass: "colorEditor",
	postCreate: function() {
		
	}
});

dojo.declare("app.widgets.ColorViewer", dijit._Widget, {
	baseClass: "colorViewer",
	postCreate: function() {
		this.domNode = dojo.create("div", {
			style: {
				'background-color': this.value
			},
			innerHTML: "&nbsp;"
		});
	},
	
	set: function(name, value) {
		if (name == "value") {
			this.value = value;
			dojo.style(this.domNode, {
				'background-color': this.value
			});
			return value;
		}
		return this.inherited(arguments);
	}
});
