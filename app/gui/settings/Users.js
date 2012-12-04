dojo.provide("app.gui.settings.Users"); 

dojo.declare("app.gui.settings.Users", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "Users"
		});
		
		this.grid = new dojox.grid.DataGrid({
			structure: [
				{field: "login", name: "Login", width: "50%"},
				{field: "name", name: "Jméno", width: "50%"}
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
		hashParam.user_id = rowData.user_id;
		
		app.updateHash(hashParam);
	},
	
	onHashChanged: function(hashObject) {
		
		if (this.lastChild) {
			this.removeChild(this.lastChild);
			this.lastChild.destroyRecursive();
			delete this.lastChild;
		}
		
		if (hashObject.user_id) {
			this.lastChild = new app.widgets.form.DataForm({
				store: this.store,
				query: {
					user_id: hashObject.user_id,
				},
				region: "center"
			});
			this.addChild(this.lastChild);
		}
		
	},
	
	createUserDetail: function() {
		
	}
	
}); 
 
