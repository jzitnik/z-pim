 
dojo.provide("app.widgets.WeekCalendar");
dojo.require("dijit._Widget");
dojo.require("dojo.dnd.Source");

dojo.declare("app.widgets._EventItem", [dijit._Widget, dijit._TemplatedMixin], {
	
	templateString: dojo.cache("app.widgets", "templates/EventItem.html"),
	  
// 	'class': "eventItem",
	dateSelector: "time",
	postCreate: function() {
		this.titleNode.innerHTML = this.data.name;
		this.timeNode.innerHTML = dojo.date.locale.format(this.data.task_start, {
			selector: this.dateSelector
		});
		this.descriptionNode.innerHTML = this.data.description;
	}
	
});


dojo.declare("app.widgets._Day", dijit._Widget, {
	
	postCreate: function() {
		this.inherited(arguments);
		this.events = [];
		this.size = dojo.contentBox(this.domNode);
		
		this.dndSource = new dojo.dnd.Source(this.domNode, {
			selfAccept: true,//this.viewOptions.dndSelfAccept
// 			checkAcceptance: dojo.hitch(this, this.checkDndAcceptance),
			accept: ["event"],
// 			withHandles: true,
// 			copyOnly: true
// 			creator: this.dndCreator
		});
		
		
	},
	
	addEvent: function(eventData) {
		
		var event = new app.widgets._EventItem({
			style: {
// 				height: "10%"
			},
			'class': "dndItem eventItem",
			data: eventData
		});
		
// 		event.placeAt(this.domNode);
		dojo.attr(event.domNode, "dndType", "event");
		this.dndSource.insertNodes(false, [event.domNode]);
// 		this.dndSource.sync();
// 		event.startup();
// 		this.dndSource.startup();
	}
	
});



dojo.declare("app.widgets.WeekCalendar", dijit._Widget, {
	
	days: ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"],
	
	baseClass: "weekView",
	
	weekOffset: 0,
	
	postCreate: function() {
		this.dayWidgets = [];
		
		this.store = new app.JsonStore({
			module: "Events"
		});
		
		this.controlPanel = dojo.create("div", {
			style: {
				height: "30px",
				'text-align': "center"
			}
		}, this.domNode);
		
		this.previousWeek = new dijit.form.Button({
			label: "Předchozí týden",
			'class': "iconButton leftAligned",
			iconClass: "previous",
			onClick: dojo.hitch(this, function() {
				this.weekOffset--;
				this.renderCalendar();
			})
		});
		this.previousWeek.placeAt(this.controlPanel);
		
		this.actualWeek = new dijit.form.Button({
			label: "Vrátit se na aktuální",
			'class': "iconButton",
			iconClass: "undo",
			onClick: dojo.hitch(this, function() {
				this.weekOffset = 0;
				this.renderCalendar();
			})
		});
		this.actualWeek.placeAt(this.controlPanel);
		
		this.nextWeek = new dijit.form.Button({
			label: "Následující týden",
			'class': "iconButton rightAligned",
			iconClass: "next",
			onClick: dojo.hitch(this, function() {
				this.weekOffset++;
				this.renderCalendar();
			})
		});
		this.nextWeek.placeAt(this.controlPanel);
		
		this.renderCalendar();
	},
		
	clear: function() {
		if (this.longEvents) {
			this.longEvents.destroyRecursive();
		}
		
		for (var i in this.dayWidgets) {
			this.dayWidgets[i].destroyRecursive();
		}
		
		dojo.destroy(this.table);
	},
	
	renderCalendar: function() {
		this.clear();
		
		this.renderTable();
		
		this.store.fetch({
			query: {
				date_range: [this.getDayDate(7 * this.weekOffset), this.getDayDate((7 * this.weekOffset) + 6)],
// 				finished: false
			},
			onComplete: dojo.hitch(this, this.renderEvents)
		});
	},
		
	renderTable: function() {
		
		this.table = dojo.create("table", {
			style: {
				width: "100%",
				height: "100%"
			}
		});
		
		var head = dojo.create("thead", null, this.table);
		var headRow = dojo.create("tr", null, head);
		
		var row = dojo.create("tr", null, this.table);
		
		for (var i in this.days) {
			var date = this.getDayDate(i);
			
			dojo.create("th", {
				'class': "weekCalendarDayName",
				innerHTML: this.days[i] + " " + dojo.date.locale.format(date, {
					format: "short",
					selector: "date",
					datePattern: "d. M."
				})
			}, headRow);
			
			var wrapper = dojo.create("td");
			
			if (date.getTime() == this.roundDateToDays(new Date()).getTime()) {
				dojo.addClass(wrapper, "dayHighlighted");
			}
			
			this.dayWidgets[i] = new app.widgets._Day({
				style: {
					width: "100%",
					height: "100%",
				},
				date: date
			});
			this.dayWidgets[i].placeAt(wrapper);
			
			dojo.place(wrapper, row);
		}
		
		var headRow = dojo.create("tr", null, head);
		this.longEventsNode = dojo.create("th", {
			'class': "weekLongEvents",
			colspan: 7
		}, headRow);
		
		dojo.place(this.table, this.domNode);
	},
	
	roundDateToDays: function(date) {
		
		date = new Date(date);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		
		return date;
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
	
	renderEvents: function(data) {
		console.log(data);
		var longDurationEvents = {};
		
		var weekStartDate = this.getDayDate(7 * this.weekOffset);
		var weekEndDate = this.getDayDate((7 * this.weekOffset) + 7);
		
		for (var i in data) {
			
			//if (e.task_start <= date && date <= e.task_end) {
			data[i].duration = dojo.date.difference(this.roundDateToDays(data[i].task_start), this.roundDateToDays(data[i].task_end), "day");
			var day = -1;
			if (data[i].task_start.roundToDays() <= weekEndDate && data[i].task_end.roundToDays() >= weekStartDate) {
				data[i].day = data[i].task_start.getDay() - 1;
				day = data[i].day;
				
			}/* else if (data[i].task_start <= weekEndDate && data[i].task_end >= weekStartDate) {
					longDurationEvents.push(data[i]);
				}
			}*/
			
			//!TODO: from/to next week
			
			
			if (day >= 0 && data[i].duration < 1) {
				this.dayWidgets[day].addEvent(data[i]);
			} else if (day >= 0) {
				
				if (!(day in longDurationEvents)) {
					longDurationEvents[day] = [];
				}
				longDurationEvents[day].push(data[i]);
			}
			
			/* else {
				//if event is over more weeks
				data.duration = dojo.date.difference(weekStartDate, this.roundDateToDays(data[i].task_end));
			}*/
				
// 			if (this.roundDateToDays(data[i].task_end) > this.getDayDate(6, weekStartDate)) {
// 				data.inNextWeek = true;
// 			}
// 			
// 			if (data.task_start < weekStartDate) {
// 				data.fromPreviousWeek = true;
// 			
// 			}
		}
		
		
		for (var i in this.dayWidgets) {
			this.dayWidgets[i].dndSource.startup();
		}
		
		console.log("LONG DURATION", longDurationEvents);
		
		for (var i in longDurationEvents) {
			longDurationEvents[i].sort(this.sortByDuration);
		}
		
		this.longEvents = new app.widgets._Week({
			startDate: weekStartDate,
			month: weekStartDate.getMonth(),
			events: longDurationEvents,
			onDayClick: dojo.hitch(this, this.onDayClick)
		});
		
		this.longEvents.placeAt(this.longEventsNode);
	}
	
});