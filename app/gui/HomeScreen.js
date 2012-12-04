dojo.provide("app.gui.HomeScreen");
dojo.require("app.widgets.Overview");

dojo.require("dijit.Calendar")

dojo.declare("app.gui.HomeScreen", app.widgets.Overview, {
	region: "center",
	
	postCreate: function() {
		this.store = new app.JsonStore({
			module: "Settings"
		});
		
		this.inherited(arguments);
	},
	
	saveSettings: function(settings) {
		console.log("SETTINGS", settings);
		this.store.newItem({
			key: "homeScreen",
			value: dojo.toJson(settings)
		})
		this.store.save({
			onComplete: function() {}
		});
	},
// 	
	loadSettings: function(callback) {
		this.store.fetch({
			query: {
				key: "homeScreen"
			},
			onComplete: function(data) {
				if (data.length > 0) {
					var row = data[0]
					
					callback(dojo.fromJson(row.value));
					
				} else {
					callback({
						columns: 3,
						widgets: {}
					});
				}
			}
		});
	}
	     
});