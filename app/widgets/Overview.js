dojo.provide("app.widgets.Overview");

dojo.require("dojox.layout.GridContainer");
dojo.require("dojox.widget.Portlet");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.form.ToggleButton");
dojo.require("dijit.Dialog");

dojo.require("app.config.Dashboard");

dojo.declare("app.widgets._WidgetItem", [dijit._Widget, dijit._TemplatedMixin], {
	templateString: dojo.cache("app.widgets", "templates/DashboardWidget.html"),
	     
	postCreate: function() {
		this.nameNode.innerHTML = this.name;
		this.descriptionNode.innerHTML = this.description;
		
		this.addButton = new dijit.form.Button({
			label: "Přidat",
			onClick: dojo.hitch(this, function() {
				this.onAdd(this.widgetClass)
			})
		});
		
		this.addButton.placeAt(this.addButtonNode);
	},
	
	onAdd: function(widget) {
		
	}
});


dojo.declare("app.widgets._WidgetsBrowser", dijit.Dialog, {
	style: {
		height: "400px",
		width: "600px"
	},
	
	showWidgets: function() {
		for (var i in app.config.Dashboard.availableWidgets) {
			var item = app.config.Dashboard.availableWidgets[i];
			
			this.widgetsBrowser.addChild(new app.widgets._WidgetItem({
				name: item.name,
				description: item.description,
				widgetClass: item.widget,
				onAdd: dojo.hitch(this, function(val) {
					this.addWidget(val);
					this.hide();
					this.destroyRecursive();
				})
			}));
		}
	},
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.container = new dijit.layout._LayoutWidget({
			style: {
				height: "100%"
			}
		});
		
		this.widgetsBrowser = new dijit.layout._LayoutWidget({
			
		});
		this.showWidgets();
		this.container.addChild(this.widgetsBrowser);
		
		
// 		this.okButton = new dijit.form.Button({
// 			label: "OK"
// 		});
// 		this.cancelButton = new dijit.form.Button({
// 			label: "Storno"
// 		});
		
// 		this.buttonNode = new dijit.layout._LayoutWidget({
// 			region: "bottom"
// 		});
// 		this.buttonNode.addChild(this.okButton);
// 		this.buttonNode.addChild(this.cancelButton);
		
// 		this.container.addChild(this.buttonNode);
		
		this.set("content", this.container);
		this.container.startup();
	},
	
	addWidget: function(id) {
		
	}
});

dojo.declare("app.widgets._OverviewSettings", dijit.form.DropDownButton, {

	label: "",
	iconClass: "settings",
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.menuBar = new dijit.layout._LayoutWidget({
			
		});
		
		this.newWidgetButton = new dijit.form.Button({
			label: "Přidat widget",
			onClick: dojo.hitch(this, function() {
				var browser = new app.widgets._WidgetsBrowser({
					addWidget: this.onAddWidgetClick
				});
				browser.show();
			})
		});
		this.menuBar.addChild(this.newWidgetButton);
		
		this.columnsSettingsPlace = dojo.create("div", {
			innerHTML: "Počet sloupců"
		});
		
		this.addColumnButton = new dijit.form.Button({
			label: "+"
		});

		this.removeColumnButton = new dijit.form.Button({
			label: "-"
		});

		this.addColumnButton.placeAt(this.columnsSettingsPlace);
		this.removeColumnButton.placeAt(this.columnsSettingsPlace);

		dojo.place(this.columnsSettingsPlace, this.menuBar.domNode);

		this.widgetsLocked = new dijit.form.ToggleButton({
			checked: false,
			iconClass:"dijitCheckBoxIcon",
			label: "Widgety zamknuty",
			onChange: this.onLockToggle
		});

		this.menuBar.addChild(this.widgetsLocked);
		
		this.dropDown = this.menuBar;
	},

	onRemoveColumnClick: function() {
		
	},

	onAddColumnClick: function() {
		
	},

	onLockToggle: function(value) {
		
	},
	
	onAddWidgetClick: function(widget) {
		
	}
	
});

dojo.declare("app.widgets.Overview", dojox.layout.GridContainer, {
	
	nbZones: 3,
	liveResizeColumns: true,
	allowAutoScroll: true,
	withHandles: true,
	dragHandleClass: 'dijitTitlePaneTitle',
	isOffset: true,
	'class': "overview",
	portlets: [],
	
	postCreate: function() {
		this.inherited(arguments);
		this.disableSave = false;
		this.settingsDialog = new app.widgets._OverviewSettings({
			style: {
				position: "absolute",
				right: "0px",
				top: "0px",
				'z-index': 10000
			},
			onLockToggle: dojo.hitch(this, function(value) {
				if (value == true) {
					this.disableDnd();
				} else {
					this.enableDnd();
				}
			}),
			onAddWidgetClick: dojo.hitch(this, function(widget) {
				this.addChild(new widget());
				this.createSettings();
			})
		});
		
		
		this.settingsDialog.placeAt(this.domNode);
		
		this.loadSettings(dojo.hitch(this, this.onSettingsLoaded));
		
		this._connects.push(dojo.connect(this, "resizeChildAfterDrop", this, this.createSettings));
				
	},
	
	onSettingsLoaded: function(settings) {
		this.settings = settings;
		this.setColumns(settings.columns);
		
		var pthis = this;
		
		for (var col in settings.widgets) {
			for (var i in settings.widgets[col]) {
				var clazz = dojo.getObject(settings.widgets[col][i], true);
				var child = new clazz();
				child._connects.push(dojo.connect(child, "onClose", child, function() {
					pthis.removeChild(this);
					pthis.createSettings();
				}));
				this.addChild(child, col);
			}
		}
	},
	
	addChild: function(child) {
// 		var portlet = new dojox.widget.Portlet({
// 			closable: true,
// 			title: "Kalendář"
// 		});
// 		
// 		portlet.addChild(child);
// 		
// 		arguments[0] = portlet;
		child.set("closable", true);
		this.inherited(arguments);
	},
	
	createSettings: function() {
		if (this.disableSave == true) {
			return;
		}
		
		var settings = {
			columns: this.get("nbZones"),
			widgets: {}
		}
		
		var childs = this.getChildren();
		for (var i in childs) {
			if (childs[i]== this.settingsDialog) {
				continue;
			}
			
			var column = childs[i].get("column");
			if (!(column in settings.widgets)) {
				settings.widgets[column] = [];
			}
			
			settings.widgets[column].push(childs[i].declaredClass);
		}
		
		this.saveSettings(settings);
	},
	
	saveSettings: function(settings) {
		
	},
	
	loadSettings: function(callback) {
		callback({
			columns: 3,
			widgets: {}
		});
	}
	
});
