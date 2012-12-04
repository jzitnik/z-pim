dojo.provide("app.gui.calendar.Tasks");

dojo.require("dojox.grid.DataGrid");
dojo.require("app.JsonStore");

dojo.declare("app.gui.calendar.Tasks", app.widgets.Container, {
	
	filter: {
		finished: false
	},
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Tasks"
		});
		
		
		this.filterTable = new dojox.layout.TableContainer({
			cols: 1,
			labelWidth: "50%",
			region: "top"
		});
		
		this.finishedFilter = new dijit.form.CheckBox({
			title: "Pouze nedokončené",
			checked: "checked",
			onChange: dojo.hitch(this, function(value) {
				this.tasksList.setQuery(dojo.mixin(this.filter, {
					finished: value ? false : undefined
				}));
			})
		});
		
		this.filterTable.addChild(this.finishedFilter);
		
		this.addChild(this.filterTable);
		
		this.tasksList = new app.widgets.form.DataForm({
			store: this.store,
			region: "center",
			query: this.filter,
// 			getTemplate: function(dataRow) {
// 				return dojo.cache("app", "templates/TasksList.html");
// 			},
			visibleButtons: ["edit", "delete"],
			onFieldStartup: function(field) {
				//!WARNING - DataForm scope
				
				field.widgets.finished.set("disabled", false);
				
				field.widgets.finished.onChange = dojo.hitch(this, function(value) {
					
					if (value != true) {
						return;
					}
					
					this.store.setValue(field.data, "finished", true);
					
					this.store.save({
						onComplete: function() {
							dojo.animateProperty({
								node: field.domNode,
								properties: {
									height: 0,
									opacity: 0
								},
								onEnd: function() {
									field.destroyRecursive();
								}
							}).play();
						}
					})
					
					
				})
			}
			
		});
		this.addChild(this.tasksList);
	}
	
}); 
