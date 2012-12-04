dojo.provide("app.gui.contacts.ViewContacts"); 

dojo.require("app.widgets.ContactDetail");

dojo.declare("app.gui.contacts.ViewContacts", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Contacts"
		});
		
		this.grid = new dojox.grid.DataGrid({
			structure: [
				{field: "name", name: "Název", width: "100%"}
			],
			store: this.store,
			style: {
				width: "30%"
			},
			region: "left",
			onRowClick: dojo.hitch(this, this.onGridRowClick)
		});
		
		this.addChild(this.grid);
		
	},
	
	onGridRowClick: function(event) {
		var rowData = this.grid.getItem(event.rowIndex);
		
		var hashParam = {};
		hashParam.contact_id = rowData.contact_id;
		
		app.updateHash(hashParam);
	},
	
	onHashChanged: function(hashObject) {
		
		if (this.lastChild) {
			this.removeChild(this.lastChild);
			this.lastChild.destroyRecursive();
			delete this.lastChild;
		}
		
		if (hashObject.contact_id) {
			this.lastChild = new app.widgets.ContactDetail({
				contact_id: hashObject.contact_id,
				region: "center"
			});
			this.addChild(this.lastChild);
		}
		
	}
	
}); 
