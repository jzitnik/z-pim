dojo.provide("app.gui.notes.NewNote");
dojo.require("app.widgets.Container");
dojo.require("app.JsonStore");
dojo.require("app.widgets.form.DataForm");

dojo.declare("app.gui.notes.NewNote", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Notes"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "top",
			visibleButtons: [],
			onFieldStartup: dojo.hitch(this, function(field) {
				field.saveButton.set("region", "center");
				this.addChild(field.saveButton);
			})
		});
		
		this.addChild(this.form);
		
		
	}
});