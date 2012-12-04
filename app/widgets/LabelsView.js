dojo.provide("app.widgets.LabelsView");

dojo.require("app.JsonStore");
dojo.require("dijit._Widget");
dojo.require("dijit.form.Button");

dojo.declare("app.widgets.LabelsView", dijit._Widget, {
	baseClass: "labelsView",
	postCreate: function() {
		this.store = new app.JsonStore({
			module: "Labels"
		});
		
		this.store.fetch({
			query: {}, 
			onComplete: dojo.hitch(this, this.render), 
		});
		
		dojo.place(dojo.create("div", {
			innerHTML: "Štítky",
			'class': "labelsViewTitle"
		}), this.domNode);
		
	},
	
	render: function(data) {
		this.checkBoxies = [];
		for (var i in data) {
			var widget = dojo.create("div", {
				'class': "labelsViewItem"
			}, this.domNode);
			var checkBox = new dijit.form.CheckBox({
				value: data[i].name,
				onChange: dojo.hitch(this, this._onChange)
			});
			checkBox.placeAt(widget);
			this.checkBoxies.push(checkBox);
			
			var color = data[i].color;
			
			var arrow = dojo.create("div", {
				'class': "labelArrow",
				style: {
					'border-color': color
				}
			}, widget);
			
			dojo.create("span", {
				'class': "labelArrowTriangle",
				style: {
					'border-left-color': color
				}
			}, arrow);
			
			dojo.create("span", {
				innerHTML: data[i].name,
				'class': "labelsViewLabelName"
			}, widget);
		}
	},
	
	_onChange: function(value) {
		var checked = [];
		for (var i in this.checkBoxies) {
			if (this.checkBoxies[i].get("value")) {
				checked.push(this.checkBoxies[i].get("value"));
			}
		}
		
		this.value = checked;
		this.onChange(checked);
	}
});