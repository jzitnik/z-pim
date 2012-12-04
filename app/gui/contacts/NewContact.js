dojo.provide("app.gui.contacts.NewContact"); 

dojo.declare("app.gui.contacts.NewContact", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Contacts"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			style: {
				width: "70%"
			},
			onEdited: function(data) {
				app.updateHash({
					page: "contacts/viewContacts",
					contact_id: data.contact_id
				});
			}
		});
		
		this.addChild(this.form);
		
	}
	
});