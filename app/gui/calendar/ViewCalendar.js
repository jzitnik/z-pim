dojo.provide("app.gui.calendar.ViewCalendar");
dojo.require("app.widgets.Container");
dojo.require("app.widgets.BigCalendar");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojox.layout.TableContainer");
// dojo.require("dojox.grid.EnhancedGrid");
// dojo.require("dojox.grid.enhanced.plugins.DnD");



dojo.declare("app.gui.calendar.ViewCalendar", app.widgets.Container, {
// 	'class': "La
// 	region: "center",
	filter: {
		finished: false
	},
	labelQuery: null,
	postCreate: function() {
		
		this.calendarWrapper = new dijit.layout._LayoutWidget({
			region: "left",
			style: {
				width: "420px",
				'margin-right': "30px"
			}
		});
		
		this.labelQuery = dojo.queryToObject(dojo.hash()).label;
		
		this.addChild(this.calendarWrapper);
		
		this.eventsStore = new app.JsonStore({
			module: "Events"
		});
		
		this.eventsStore.fetch({
			query: {
				labels: this.labelQuery
			},
			onComplete: dojo.hitch(this, this.renderCalendar)
		});
		
		var date = (new Date()).roundToDays();
		
		this.eventsList = new app.widgets.form.DataForm({
			store: this.eventsStore,
			region: "center",
			query: {
				task_start: date,
				task_end: date,
				finished: false,
				labels: this.labelQuery
			},
			getTemplate: function(dataRow) {
				return dojo.cache("app", "templates/EventsList.html");
			},
			visibleButtons: [],
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
		
		this.addChild(this.eventsList);
		
	},
	
	renderCalendar: function(events) {
		
		this.calendarEvents = events;
		
		this.calendar = new dijit.Calendar({
			style: {
				height: "400px",
				width: "400px"
			},
			onValueSelected: dojo.hitch(this, function(date) {
				
				date = date.roundToDays();
				
				this.eventsList.setQuery(dojo.mixin(this.filter, {
					task_start: date,
					task_end: date,
					labels: this.labelQuery
				}));
			}),
			getClassForDate: dojo.hitch(this, function(date) {
				
				for (var i in events) {
					var e = events[i];
					
					e.task_start = e.task_start.roundToDays();
					e.task_end = e.task_end.roundToDays();
					date = date.roundToDays();
					
					
					if (e.task_start <= date && date <= e.task_end) {
						
						if (date >= (new Date()).roundToDays()) {
							return "event";
						} else {
							return "passedEvent";
						}
					}
				}
				
				return "empty";
			})
		});
		
		this.calendarWrapper.addChild(this.calendar);
		
		this.calendar.goToToday();
		
		
		//query filter
		this.filterTable = new dojox.layout.TableContainer({
			cols: 1,
			labelWidth: "50%"
		});
		
		this.finishedFilter = new dijit.form.CheckBox({
			title: "Pouze nedokončené",
			checked: "checked",
			onChange: dojo.hitch(this, function(value) {
				this.eventsList.setQuery(dojo.mixin(this.filter, {
					finished: value ? false : undefined
				}));
			})
		});
		
		this.filterTable.addChild(this.finishedFilter);
		
		this.calendarWrapper.addChild(this.filterTable);
		
		this.onCalendarRender();
	},
	
	onCalendarRender: function() {
		
	},
	
	onHashChanged: function(hash) {
		console.log("HU", hash);
		
		if (hash.labels) {
			self.labelQuery = hash.labels;
		}
	}
	
}); 
