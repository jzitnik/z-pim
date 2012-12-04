dojo.provide("app.widgets.ContactDetail");

dojo.declare("app.widgets.ContactDetail", dijit._Widget, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Contacts"
		});
		
		this.form = new app.widgets.form.DataForm({
			query: {
				contact_id: this.contact_id
			},
			store: this.store
		});
		
		this.form.placeAt(this.domNode);
		
		this.paramsStore = new app.JsonStore({
			module: "ContactsParams"
		});
		
		this.paramsForm = new app.widgets.form.DataForm({
			query: {
				contact_id: this.contact_id
			},
			store: this.paramsStore,
			staticData: {
				contact_id: this.contact_id
			}
		});
		
		dojo.place(dojo.create("hr", {
			'class': "smallSeparator"
		}), this.domNode);
		
		this.addButton = new dijit.form.Button({
			'class': "iconButton",
			iconClass: "add",
			label: "Přidat položku",
			onClick: dojo.hitch(this, function() {
				this.paramsForm.insertRow();
			})
		});
		this.addButton.placeAt(this.domNode);
		
		this.paramsForm.placeAt(this.domNode);
		
	}
	
});
