dojo.provide("app.widgets.timetable.FilteringSelect");

dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.data.QueryReadStore");
dojo.require("dijit.form.Button");

dojo.declare("app.widgets.timetable.FilteringSelect", dijit.layout._LayoutWidget, {
	
	postCreate: function() {
		
		this.store= new app.JsonStore({
			module: "timetable/VsbTimetable",
// 			getValue: function(/* item */ item, /* attribute-name-string */ attribute, /* value? */ defaultValue){
// 				//	According to the Read API comments in getValue() and exception is
// 				//	thrown when an item is not an item or the attribute not a string!
// 				this._assertIsItem(item);
// 				if(!dojo.isString(attribute)){
// 					throw new Error(this._className+".getValue(): Invalid attribute, string expected!");
// 				}
// 				if(!this.hasAttribute(item, attribute)){
// 					// read api says: return defaultValue "only if *item* does not have a value for *attribute*."
// 					// Is this the case here? The attribute doesn't exist, but a defaultValue, sounds reasonable.
// 					if(defaultValue){
// 						return defaultValue;
// 					}
// 				}
// 				return item.i[attribute];
// 			},
		});
		
		this.filteringSelect = new dijit.form.FilteringSelect({
			store: this.store,
			searchAttr: "name",
			autoComplete: false,
			highlightMatch: "all",
			labelFunc: function(item, store){
				return item[this.searchAttr]; // String
			},
			_getValueAttr: function(){
				return this.item ? this.item : null;
			},
		});
		
		this.addChild(this.filteringSelect);
		
		this.addButton = new dijit.form.Button({
			label: "Přidat",
			onClick: dojo.hitch(this, function() {
				this.add(this.filteringSelect.get("value"));
				this.filteringSelect.reset();
			})
		});
		
		this.addChild(this.addButton);
	},
	
	add: function(value) {
		
	}
	
});