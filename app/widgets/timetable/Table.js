dojo.provide("app.widgets.timetable.Table");

dojo.require("dijit.form.CheckBox");

dojo.declare("app.widgets.timetable.Lesson", dijit._Widget, {
	'class': "lesson",
	postCreate: function() {
		this.inherited(arguments);
		
		this.nameNode =  dojo.create("div", {
			innerHTML: this.name
		})
		dojo.place(this.nameNode, this.domNode);
		
		this.titleNode = dojo.create("div", {
			innerHTML: this.lessonId,
			style: {
				display: "inline"
			}
		});
		
		this.checkbox = new dijit.form.CheckBox({
			style: {
				float: "right"
			},
			onChange: dojo.hitch(this, function(checked) {
				this.onChange(checked, this.lessonId);
			})
		});
		
		dojo.place(this.titleNode, this.domNode);
		this.checkbox.placeAt(this.domNode);
	},
	
	onChange: function() {
		
	},
	
	set: function(name, value) {
		this.inherited(arguments);
		
		if (name == "enabled") {
			this.checkbox.set("disabled", !value);
			dojo.style(this.domNode, {
				opacity: value ? 1 : 0.3
			});
		}
	}
	
});

dojo.declare("app.widgets.timetable.Topic", null, {
	
	
	constructor: function(args) {
		dojo.mixin(this, args);
		
		this.lessons = {}; //cvika
		this.lectures = {}; //prednasky
		
		var color = '#' + (function co(lor){   return (lor += 
		[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) 
		&& (lor.length == 6) ?  lor : co(lor); })('');
		
		for (var i in this.lessonData.data) {
			var lesson = new app.widgets.timetable.Lesson({
				hour: this.lessonData.data[i].hour,
				day: this.lessonData.data[i].day,
				lessonId: this.lessonData.data[i].id,
				length: this.lessonData.data[i].length,
				name: this.lessonData.data[i].name,
				style: {
					'background-color': color
				}
			});
			
			if (this.lessonData.data[i].type == "P") {
				lesson.onChange = dojo.hitch(this, this.lecturesChange);
				this.lectures[this.lessonData.data[i].id] = lesson;
			} else {
				lesson.onChange = dojo.hitch(this, this.lessonsChange);
				this.lessons[this.lessonData.data[i].id] = lesson;
			}
		}
	},
	
	lessonsChange: function(checked, lessonId) {
		for (var i in this.lessons) {
			if (this.lessons[i].lessonId == lessonId) {
				continue;
			}
			
			this.lessons[i].set("enabled", !checked);
		}
	},
	
	lecturesChange: function(checked, lessonId) {
		for (var i in this.lectures) {
			if (this.lectures[i].lessonId == lessonId) {
				continue;
			}
			
			this.lectures[i].set("enabled", !checked);
		}
	},
	
	getLesson: function(day, hour) {
		for (var i in this.lessons) {
			if (day == this.lessons[i].day && hour == this.lessons[i].hour) {
				return this.lessons[i];
			}
		}
		return false;
	},
	
	getAllLessons: function() {
		return dojo.mixin({}, this.lessons, this.lectures);
	},
	
	destroy: function() {
		for (var i in this.lessons) {
			this.lessons[i].destroyRecursive();
		}
		
		for (var i in this.lectures) {
			this.lectures[i].destroyRecursive();
		}
		
		this.lessons = {}
		this.lectures = {}
	}
	
});

dojo.declare("app.widgets.timetable.Table", dijit._Widget, {
	
	table: [],
	topics: {},
	
	days: ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
	hours: [
		"7:15 - 8:00",
		"8:00 - 8:45",
		"9:00 - 9:45",
		"9:45 - 10:30",
		"10:45 - 11:30",
		"11:30 - 12:15",
		"12:30 - 13:15",
		"13:15 - 14:00",
		"14:15 - 15:00",
		"15:00 - 15:45",
		"16:00 - 16:45",
		"16:45 - 17:30",
		"17:45 - 18:30",
		"18:30 - 19:15"
	],
	
	createTableContent: function() {
		
		var row = dojo.create("tr");
		dojo.place(row, this.tableNode);
		
		dojo.place(dojo.create("td", {
			innerHTML: ""
		}), row);
		for (var a = 0; a <= 13; a++) {
			dojo.place(dojo.create("td", {
				innerHTML: this.hours[a]
			}), row);
		}
		
		for (var i = 0; i <= 5; i++) { //dny
			this.table[i] = [];
			
			var row = dojo.create("tr");
			dojo.place(row, this.tableNode);
			
			dojo.place(dojo.create("td", {
				innerHTML: this.days[i]
			}), row);
			
			for (var a = 0; a <= 13; a++) {
				this.table[i][a] = dojo.create("td", {
					style: {
						width: 100/14 + "%"
					}
				});
				
				dojo.place(this.table[i][a], row);
			}
		}
	},
	
	postCreate: function() {
		this.tableNode = dojo.create("table", {
			style: {
				height: "100%",
				width: "100%"
			}
		});
		
		this.createTableContent();
		
		dojo.place(this.tableNode, this.domNode);
		
	},
	
	addLesson: function(lessonData) {
		console.log("ADD", lessonData);
		var lessons = new app.widgets.timetable.Topic({
			lessonData: lessonData
		});
		
		this.topics[lessonData.lessonId] = lessons;
		
		var tmp = lessons.getAllLessons();
		for (var i in tmp) {
			var lesson = tmp[i];
			var size = dojo.contentBox(this.table[lesson.day][lesson.hour]);
			
// 			dojo.style(lesson.domNode, {
// 				width: size.w*lesson.length + "px !important",
// 				clear: "both"
// 			});
			
			dojo.place(lesson.domNode, this.table[lesson.day][lesson.hour]);
		}
		
	},
	
	removeLesson: function(lessonId) {
		this.topics[lessonId].destroy();
		delete this.topics[lessonId];
	}
	
	
});
