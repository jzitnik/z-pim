dojo.provide("app.widgets.MonthView");
dojo.require("dijit._TemplatedMixin")
dojo.require("dijit._Widget");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.popup");
dojo.require("dijit._HasDropDown");

dojo.declare("app.widgets._MonthEventItem", [dijit._Widget, dijit._TemplatedMixin, dijit._HasDropDown], {
	
	templateString: dojo.cache("app.widgets", "templates/MonthEventItem.html"),
	  
	baseClass: "eventItem",
	
	postCreate: function() {
		this.titleNode.innerHTML = this.data.name;
		this.timeNode.innerHTML = dojo.date.locale.format(this.data.task_start, {
			selector: "time"
		});
		
		if (this.data.task_end < new Date()) {
			dojo.addClass(this.domNode, "eventPassed");
		}
		
		this.dropDown = new dijit.TooltipDialog({
			content: new app.widgets._EventItem({
				data: this.data,
				dateSelector: "datetime",
				'class': "monthEventDetail"
			}),
			onBlur: function() {
				dijit.popup.close(this);
			}
		});
		
// 		this.tooltip.on("blur", function() {
// 				dijit.popup.close(this);
// 		});
		
		this._connects.push(dojo.connect(this, "onClick", this, function(event) {
			dojo.stopEvent(event);
			this.toggleDropDown();
			return false;
		}));
		
		
	},
	
	
});


dojo.declare("app.widgets._Week", dijit._Widget, {
	baseClass: "weekOfMonth",
	postCreate: function() {
		this.eventsTable = dojo.create("table", {
			'class': "weekOfMonthEventsTable"
		}, this.domNode);
		
		this.backgroundTable = dojo.create("table", {
			'class': "monthBackgroundTable"
		}, this.domNode);
		
		var bgRow = dojo.create("tr", {
			'class': "weekOfMonthBg",
			
			
		}, this.backgroundTable);
		
// 		this.indexEvents();
		
		var header = dojo.create("thead", null, this.eventsTable);
		var headerRow = dojo.create("tr", null, header);
		
		var body = dojo.create("tbody", null, this.eventsTable);
		var row = dojo.create("tr", {
			valign: "top"
		}, body);
		
		var pthis = this;
		
		var lastLongDuration = 100;
		
		for (var i = 0; i < 7; i++) {
			var date = dojo.date.add(this.startDate, "day", i);
			
			var clazz = "dayOfMonth";
			
			if (date.getMonth() != this.month) {
				clazz = "dayOfLastMonth";
			}
			
			//fill backgroundTable
			var bg = dojo.create("td", {
				'class': clazz,
				'data-date': date,
				onclick: function() {
					pthis.onDayClick(new Date(dojo.attr(this, 'data-date')));
				}
			}, bgRow);
			
			if (date.getTime() == this.roundDateToDays(new Date()).getTime()) {
				dojo.addClass(bg, "dayHighlighted");
			}
			
			
			dojo.create("td", {
				innerHTML: dojo.date.locale.format(date, {
					format: "short",
					selector: "date",
					datePattern: "d. M."
				}),
				style: {
					width: "14%"
				},
				'data-date': date,
				onclick: function() {
					pthis.onDayClick(new Date(dojo.attr(this, 'data-date')));
				}
			}, headerRow);
			
			var tdForDay = dojo.create("td", {
				style: {
					width: "14%"
				},
				'data-date': date,
				onclick: function() {
					pthis.onDayClick(new Date(dojo.attr(this, 'data-date')));
				}
			}, row);
			
			if (this.events[i]) {
				for (var e in this.events[i]) {
					var eventData = this.events[i][e];
					
// 					var tmp = null;
					
					if (eventData.duration > 7 - i) {
						eventData.duration = 7 - i;
					}
					
					if (eventData.duration > 0 && lastLongDuration > i) {
						tmp = this.createEventNode(body, i, eventData.duration+1);
						lastLongDuration = i + eventData.duration;
					} else if (eventData.duration > 0 && tmp) {
						//pripojit za posledni udalost pres vice dni
						tmp = this.attachEventToNode(tmp, i, eventData.duration+1);
						lastLongDuration = i + eventData.duration;
					}
					
					var eventWidget = new app.widgets._MonthEventItem({
						'class': "dndItem",
						data: eventData
					});
					
					eventWidget.placeAt((eventData.duration > 0) ? tmp : tdForDay);
					
				}
			}
			
		}
	},
	
	roundDateToDays: function(date) {
		
		date = new Date(date);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return date;
	},
	
	attachEventToNode: function(tdNode, position, cellspacing) {
		var parentTr = tdNode.parentNode;
		
		var colCount = 0;
		var toDestroy = [];
		var wantedTd = null;
		for (var i = 0; i < tdNode.parentNode.cells.length; i++) {
			var cell = tdNode.parentNode.cells[i];
			
			colCount += cell.colSpan;
			if (colCount == position+1) {
				dojo.attr(cell, "colspan", cellspacing);
				wantedTd = cell;
			}
			
			if (colCount > position+1 && colCount <= position + cellspacing) {
				toDestroy.push(cell);
			}
		}
		
		for (var i  in toDestroy) {
			dojo.destroy(toDestroy[i]);
		}
		
		return wantedTd;
		
	},
	
	createEventNode: function(tableNode, before, cellspacing) {
		
		var row = dojo.create("tr", null, tableNode);
		
		for (var i = 0; i < before; i++) {
			dojo.create("td", {
				style: {
					width: "14%"
				},
			}, row);
		}
		
// 		var pthis = this;
		var td = dojo.create("td", {
			style: {
				width: (14*cellspacing) + "%"
			},
// 			'data-date': date,
// 			onclick: function() {
// 				pthis.onDayClick(new Date(dojo.attr(this, 'data-date')));
// 			},
		       colspan: cellspacing
		}, row);
		
		if (before+cellspacing < 7) {
			//doplneni do konce tydne
			for (var i = before+cellspacing; i < 7; i++) {
				dojo.create("td", {
					style: {
						width: "14%"
					},
				}, row);
			}
		}
		
		return td;
	},
	
	startup: function() {
		this.inherited(arguments);
	},
	
	onDayClick: function(date) {
		
	}
	
});


dojo.declare("app.widgets.MonthView", [dijit._Widget], {
	
	'class': "monthView",
	
// 	templateString: dojo.cache("app.widgets", "templates/MonthView.html"),
	     
	height: 6,

	postCreate: function() {
		this.now = new Date();
		this.labels = null;
		this.weeks = [];
		this.controlPanel = dojo.create("div", {
			style: {
				height: "30px",
				'text-align': "center"
			}
		}, this.domNode);
		
		this.previousButton = new dijit.form.Button({
			label: "Předchozí měsíc",
			'class': "iconButton leftAligned",
			iconClass: "previous",
			
			onClick: dojo.hitch(this, function() {
				this.clear();
				this.now.setMonth(this.now.getMonth() - 1);
				this.fetch(this.now);
			})
		});
		this.previousButton.placeAt(this.controlPanel);
		
		this.monthLabel = dojo.create("span", {
			'class': "monthLabel",
		}, this.controlPanel);
		
		this.previousButton = new dijit.form.Button({
			label: "Aktuální měsíc",
			'class': "iconButton topAligned",
			iconClass: "undo",
			
			onClick: dojo.hitch(this, function() {
				this.clear();
				this.now = new Date();
				this.fetch(this.now);
			})
		});
		this.previousButton.placeAt(this.controlPanel);
		
		this.nextButton = new dijit.form.Button({
			label: "Následující měsíc",
			'class': "iconButton rightAligned",
			iconClass: "next",
			
			onClick: dojo.hitch(this, function() {
				this.clear();
				this.now.setMonth(this.now.getMonth() + 1);
				this.fetch(this.now);
			})
		});
		this.nextButton.placeAt(this.controlPanel);
		
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		this.fetch(this.now);
		
	},
	
	set: function(name, value) {
		if (name == "labels") {
			this.labels = value;
			this.fetch(this.now);
			
		}
		return this.inherited(arguments);
	},
	
	fetch: function(monthDate) {
		
		var monthStart = new Date(new Date(monthDate).setDate(1));
		var monthEnd = new Date(new Date(monthDate).setDate(dojo.date.getDaysInMonth(new Date(monthDate))));
		
// 		this.monthLabel.innerHTML = dojo.date.locale.format(monthStart, {
// 			selector: "date",
// 			datePattern: "MMMM y"
// 		});
// 		
		this.monthLabel.innerHTML = dojo.date.locale.getNames("months", "wide", "standAlone", "cs")[monthStart.getMonth()].capitalize();
		this.monthLabel.innerHTML += " " + monthStart.getFullYear();
		
		
		this.store.fetch({
			query: {
				date_range: [monthStart, monthEnd],
				labels: this.labels
			},
			onComplete: dojo.hitch(this, this.renderCalendar)
		});
	},
	
	clear: function() {
		for (var i in this.weeks) {
			this.weeks[i].destroyRecursive();
		}
	},
	
	renderCalendar: function(data) {
		this.data = data;
		
		for (var i in this.weeks) {
			this.weeks[i].destroyRecursive();
			delete this.weeks[i];
		}
		
		this.weeks = [];
		
		var monthStart = new Date(new Date(this.now).setDate(1));
		var startDay = this.getDayDate(1, monthStart);
		
		for (var i = 0; i < this.height; i++) {
			var startDate = this.getDayDate(i * 7, monthStart);
			var week = new app.widgets._Week({
				startDate: startDate,
				month: monthStart.getMonth(),
				style: {
					height: "16%",
					position: "relative"
				},
				events: this.getEventsForWeek(startDate),
				onDayClick: dojo.hitch(this, this.onDayClick)
// 				getEventsInDay: dojo.hitch(this, this.getEventsInDay)
			});
			
			week.placeAt(this.domNode);
			this.weeks.push(week);
		}
		
	},
	
	roundDateToDays: function(date) {
		
		date = new Date(date);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return date;
	},
	
	getEventsForWeek: function(weekStartDate) {
		var events = {};
		for (var i in this.data) {
			var data = dojo.mixin({}, this.data[i]);
			if (this.roundDateToDays(data.task_start) <= this.getDayDate(6, weekStartDate)
				&& this.roundDateToDays(data.task_end) >= weekStartDate)
			{
				var duration = dojo.date.difference(this.roundDateToDays(data.task_start), this.roundDateToDays(data.task_end), "day");
				data.duration = duration;
				
				if (data.task_start > weekStartDate) {
					var day = data.task_start.getDay() - 1;
					
				} else {
					//if event is over more weeks
					var day = 0;
					data.duration = dojo.date.difference(weekStartDate, this.roundDateToDays(data.task_end));
				}
				
				if (this.roundDateToDays(data.task_end) > this.getDayDate(6, weekStartDate)) {
					data.inNextWeek = true;
				}
				
				if (data.task_start < weekStartDate) {
					data.fromPreviousWeek = true;
				}
				
				//sunday patch
				if (day < 0) {
					day = 6
				}
				
				if (!(day in events)) {
					events[day] = [];
				}
				events[day].push(data);
			}
		}
		
		for (var day in events) {
			events[day].sort(this.sortByDuration);
		}
		
		return events;
	},
	
	sortByDuration: function(a, b) {
		return b.duration -  a.duration;
	},
	
	getDayDate: function(day, fromDate) {
		
		if (!fromDate) {
			fromDate = new Date();
		}
		
		var date = new Date(fromDate.getTime() - ((fromDate.getDay() - day - 1) * 1000 * 60 * 60 * 24));
		return this.roundDateToDays(date);
	},
	
	startup: function() {
		this.inherited(arguments);
		
		for (var i in this.weeks) {
			this.weeks[i].startup();
		}
	},
	
	onDayClick: function(day) {
		
	}
	
});
