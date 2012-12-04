dojo.provide("app.widgets.dashboard.Today"); 

dojo.require("dojox.widget.Portlet");

dojo.declare("app.widgets.dashboard.Today", dojox.widget.Portlet, {
	
	title: "Poslední úkoly",
	closable: true,
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		var date = (new Date()).roundToDays();
		
		this.store.fetch({
			query: {
				task_start: date,
				task_end: date,
				finished: false
			},
			onComplete: dojo.hitch(this, this.renderEvents)
		})
		
	},
	
	renderEvents: function(data) {
		if (data.length < 1) {
			this.addChild(new dijit.layout.ContentPane({
				content: "Dnes nemáte žádné události"
			}));
			return;
		}
		for (var i in data) {
			var event = app.widgets._MonthEventItem({
				data: data[i]
			});
			this.addChild(event);
		}
		
	}
}); 
