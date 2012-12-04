dojo.provide("app.widgets.NoteViewer");

dojo.require("app.widgets.NoteViewer");

dojo.declare("app.widgets.NoteViewer", dijit._Widget, {
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Notes"
		});
		
		this.controlPanel = dojo.create("div", null, this.domNode);
		
		this.createEvent = new dijit.form.Button({
			label: "Vytvořit událost",
			disabled: true,
			onClick: dojo.hitch(this, function() {
				this.createEvent.set("disabled", true);
				this.createTask.set("disabled", true);
				this.onCreateEvent();
			}),
			onMouseDown: function(event) {
				dojo.stopEvent(event);
				return false;
			}
		});
		this.createEvent.placeAt(this.controlPanel);
		
		this.createTask = new dijit.form.Button({
			label: "Vytvořit úkol",
			disabled: true,
			onClick: dojo.hitch(this, function() {
				this.createEvent.set("disabled", true);
				this.createTask.set("disabled", true);
				this.onCreateTask();
			}),
			onMouseDown: function(event) {
				dojo.stopEvent(event);
				return false;
			}
		});
		this.createTask.placeAt(this.controlPanel);
		
		this._connects.push(dojo.connect(this, "onMouseUp", this, this.onTextSelected));
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			query: {
				object_id: this.object_id
			}
		});
		
		this.form.placeAt(this.domNode);
	},
	
	onTextSelected: function() {
		var selection = app.getSelection().toString();
		
		if (selection != "") {
			this.createEvent.set("disabled", false);
			this.createTask.set("disabled", false);
		} else {
			this.createEvent.set("disabled", true);
			this.createTask.set("disabled", true);
		}
		this.selection = selection;
	},
	
	onCreateEvent: function() {
		
	},
	
	onCreateTask: function() {
		
	}
	
	
});