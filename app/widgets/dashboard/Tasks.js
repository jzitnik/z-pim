dojo.provide("app.widgets.dashboard.Tasks"); 

dojo.require("dojox.widget.Portlet");
dojo.require("app.widgets.MonthView");

dojo.declare("app.widgets.dashboard.Tasks", dojox.widget.Portlet, {
	
	title: "Poslední úkoly",
	closable: true,
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Tasks"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			query: {
				finished: false
			},
			visibleButtons: []
		});
		
		this.addChild(this.form);
		
	}
	
}); 
