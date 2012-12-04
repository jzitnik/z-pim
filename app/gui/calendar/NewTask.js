dojo.provide("app.gui.calendar.NewTask");

dojo.require("app.widgets.Container");
dojo.require("app.widgets.form.DataForm");
dojo.require("app.JsonStore");
 
dojo.declare("app.gui.calendar.NewTask", app.widgets.Container, {

	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "center"
		});
		
		this.addChild(this.form);
		
	}
	
});