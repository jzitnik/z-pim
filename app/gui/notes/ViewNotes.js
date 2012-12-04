dojo.provide("app.gui.notes.ViewNotes");

dojo.require("dojox.grid.DataGrid");
dojo.require("app.JsonStore");
dojo.require("app.widgets.form.DataForm");
dojo.require("app.widgets.Container");
dojo.require("app.widgets.NoteViewer");

dojo.declare("app.gui.notes.ViewNotes", app.widgets.Container, {
// 	orientation: "horizontal",
	postCreate: function() {
		this.inherited(arguments);
		
		this.notesStore = new app.JsonStore({
			module: "Notes"
		});
		
		this.notesGrid = new dojox.grid.DataGrid({
			store: this.notesStore,
			autoWidth: true,
// 			layoutPriority: 1,
			structure: [[
				{name: "Název", field: "name", width: "200px"},
				{name: "Datum", field: "created", width: "200px", formatter: function(date) {
					var d = new Date(date);
					return dojo.date.locale.format(d, {selector: 'date', formatLength: 'long'});
				}}
			]],
			editable: true,
			style: {
				width: "40%"
			},
			region: "left",
			onRowClick: dojo.hitch(this, this.onGridRowClick)
		});
		
		this.addChild(this.notesGrid);
		
		
	},
	
	onGridRowClick: function(event) {
		var rowData = this.notesGrid.getItem(event.rowIndex);
		
		var hashParam = {};
		hashParam.object_id = rowData.object_id;
		
		app.updateHash(hashParam);
	},
	
	onHashChanged: function(hashObject) {
		
		if (this.lastChild) {
			this.removeChild(this.lastChild);
			this.lastChild.destroyRecursive();
			delete this.lastChild;
		}
		
		if (hashObject.object_id) {
			this.lastChild = new app.widgets.NoteViewer({
				object_id: hashObject.object_id,
				region: "center",
				'class': "detailedView",
				onCreateEvent: dojo.hitch(this, this.addEvent),
				onCreateTask: dojo.hitch(this, this.addTask)
			});
			this.addChild(this.lastChild);
		}
		
	},
	
	addEvent: function() {
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "center",
			onFieldStartup: dojo.hitch(this, function(field) {
				field.widgets.description.set("value", this.lastChild.selection);
			})
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
	
	addTask: function() {
		this.store = new app.JsonStore({
			module: "Tasks"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			insert: true,
			region: "center",
			onFieldStartup: dojo.hitch(this, function(field) {
				field.widgets.name.set("value", this.lastChild.selection);
			})
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
	}
});