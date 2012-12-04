dojo.provide("app.gui.calendar.MonthView");
dojo.require("app.widgets.Container");
dojo.require("app.widgets.MonthView");
// dojo.require("dojox.grid.EnhancedGrid");
// dojo.require("dojox.grid.enhanced.plugins.DnD");



dojo.declare("app.gui.calendar.MonthView", app.widgets.Container, {

	postCreate: function() {
		
		this.monthView = new app.widgets.MonthView({
			region: "center",
			onDayClick: dojo.hitch(this, this.addEvent)
		});
		
		this.addChild(this.monthView);
		
	},
	
	addEvent: function(day) {
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "center",
			onFieldStartup: function(field) {
				
				var now = new Date();
				day.setHours(now.getHours());
				day.setMinutes(now.getMinutes());
				
				field.widgets.task_start.set("value", day);
				
				day.setHours(day.getHours()+1);
				
				field.widgets.task_end.set("value", day);
			}
		});
		
		this.addDialog = new dijit.Dialog({
			content: this.form,
			style: {
				height: "60%",
				width: "40%",
// 				overflow: "auto"
			}
		});
		
		this.addDialog._connects.push(dojo.connect(this.addDialog, "hide", this.addDialog, function() {
			this.destroyRecursive();
		}));
		
		this.addDialog.show();
	},
	
	onHashChanged: function(hash) {
		if (hash.labels) {
			if (!(hash.labels instanceof Array)) {
				hash.labels = [hash.labels];
			}
			
			self.labelQuery = hash.labels;
			
			this.monthView.set("labels", hash.labels);
		}
	}
	
}); 
