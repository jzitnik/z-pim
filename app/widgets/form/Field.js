dojo.provide("app.widgets.form.Field");
dojo.require("app.Types");

dojo.declare("app.widgets.form.Field", [dijit._Widget, dijit._TemplatedMixin], {
	
	defaultType: "String",
	mode: "insert",
	visibleButtons: [],
	baseClass: "appFormField",
	
	constructor: function(args) {
		
		this.columns = []
		this.data = {}
		this.widgets = {}
		
		this.inherited(arguments);
	},
	
	
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.parseLabels();
		
		if (this.mode == "insert" || this.mode == "edit") {
			this.renderEdit();
		} else {
			this.renderStatic();
		}
		
		this.setData();
		
		this.saveButton = new dijit.form.Button({
			label: "Uložit",
			onClick: dojo.hitch(this, this.onStopEditClick),
			iconClass: "save",
			'class': "iconButton"
		});
		
		this.editButton = new dijit.form.Button({
			label: "Upravit",
			onClick: dojo.hitch(this, this.startEdit),
			iconClass: "edit",
			'class': "iconButton"
		});
		
		this.cancelButton = new dijit.form.Button({
			label: "Storno",
			onClick: dojo.hitch(this, this.cancelEdit),
			iconClass: "cancelEdit",
			'class': "iconButton"
		});
		
		this.deleteButton = new dijit.form.Button({
			label: "Smazat",
			onClick: dojo.hitch(this, this.onDeleteClick),
			iconClass: "delete",
			'class': "iconButton"
		});
		
		this.attachButtons();
	},
	
	setLabel: function(column, value) {
		var attachPoint = column + "_label";
		if (attachPoint in this) {
			this[attachPoint].innerHTML = value;
		}
	},
	
	parseLabels: function() {
		for (var i in this.columns) {
			this.setLabel(this.columns[i].id, this.columns[i].name);
		}
	},
	
	createEditWidget: function(column, value) {
		var type = null;
		if (column.type in app.Types) {
			type = column.type;
		} else {
			type = this.defaultType;
		}
		
		if (!value && column['default']) {
			value = column['default'];
		}
		
		args = {}
		if (typeof value != "undefined") {
			args.value = value;
		}
		
		this.widgets[column.id] = new app.Types[type].editWidget(args);
		
		var attachPoint = column.id + "_field";
		if (attachPoint in this) {
			this.widgets[column.id].placeAt(this[attachPoint]);
		}
	},
	
	createStaticWidget: function(column, value) {
		var type = null;
		if (column.type in app.Types) {
			type = column.type;
		} else {
			type = this.defaultType;
		}
		
		this.widgets[column.id] = new app.Types[type].staticWidget({
			value: value
		});
		
		var attachPoint = column.id + "_field";
		if (attachPoint in this) {
			this.widgets[column.id].placeAt(this[attachPoint]);
		}
	},
	
	renderStatic: function() {
		for (var i in this.columns) {
// 			if (this.columns[i].visibility && this.columns[i].visibility.indexOf(this.mode) >= 0) {
				this.createStaticWidget(this.columns[i], this.data[this.columns[i].id]);
// 			}
		}
	},
	
	renderEdit: function() {
		for (var i in this.columns) {
// 			if (this.columns[i].visibility && this.columns[i].visibility.indexOf(this.mode) >= 0) {
				this.createEditWidget(this.columns[i], this.data[this.columns[i].id]);
// 			}
		}
	},
	
	clearFields: function() {
		for (var i in this.widgets) {
			this.widgets[i].destroyRecursive();
			delete this.widgets[i];
		}
		
	},
	
	getData: function() {
		var data = {}
		for (var i in this.columns) {
			var column = this.columns[i];
			var id = column.id;
			
			if (this.mode == "edit" && (column.editable == false || column.visibility.indexOf("edit") < 0)) {
				continue;
			}
			
			if (this.mode == "insert" && (column.insertable == false || column.visibility.indexOf("edit") < 0)) {
				continue;
			}
			
			data[id] = this.widgets[id].get("value");
		}
		return data;
	},
	
	setData: function() {
		
	},
	
	startup: function() {
		this.inherited(arguments);
		for (var i in this.widgets) {
			this.widgets[i].startup();
		}
	},
	
	attachButtons: function() {
		if ("buttonNode" in this) {
			if (this.visibleButtons.indexOf("edit") >= 0) {
				this.editButton.placeAt(this.buttonNode);
				this.saveButton.placeAt(this.buttonNode);
			}
			
			if (this.visibleButtons.indexOf("cancelEdit") >= 0) {
				this.cancelButton.placeAt(this.buttonNode);
			}
			
			if (this.visibleButtons.indexOf("delete") >= 0) {
				this.deleteButton.placeAt(this.buttonNode);
			}
		}
		this.layoutButtons();
	},
	
	layoutButtons: function() {
		if (this.mode == "insert" || this.mode == "edit") {
			dojo.style(this.editButton.domNode, {
				display: "none"
			})
			
			dojo.style(this.cancelButton.domNode, {
				display: null
			})
			
			dojo.style(this.saveButton.domNode, {
				display: null
			})
		} else {
			dojo.style(this.editButton.domNode, {
				display: null
			})
			
			dojo.style(this.cancelButton.domNode, {
				display: "none"
			})
			
			dojo.style(this.saveButton.domNode, {
				display: "none"
			})
		}
	},
	
	stopEdit: function(newData) {
		this.mode = "static";
		
		this.data = newData;
		
		this.clearFields();
		this.renderStatic();
		this.layoutButtons();
		this.onEdited(newData);
	},
	
	cancelEdit: function() {
		this.mode = "static";
		
		this.clearFields();
		this.renderStatic();
		this.layoutButtons();
		this.onCancelEdit();
	},
	
	startEdit: function() {
		this.mode = "edit";
		
		this.clearFields();
		this.renderEdit();
		this.layoutButtons();
		this.onStartEdit();
	},
	
	onStartEdit: function() {
	},
	
	onCancelEdit: function() {
	},
	
	onEdited: function() {
	
		
	},
	
	onStopEditClick: function() {
		
	},
	
	onDeleteClick: function() {
		
	}
	
});

