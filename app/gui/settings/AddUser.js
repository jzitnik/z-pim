dojo.provide("app.gui.settings.AddUser"); 

dojo.declare("app.gui.settings.AddUser", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Users"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "center"
		});
		
		this.addChild(this.form);
	}
	
}); 
 
