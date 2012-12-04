dojo.provide("app.gui.tools.VsbTimetable");

dojo.require("app.widgets.Container");

dojo.require("app.widgets.timetable.FilteringSelect");
dojo.require("app.widgets.timetable.LessonList");
dojo.require("app.widgets.timetable.Table");

dojo.declare("app.gui.tools.VsbTimetable", dijit.layout._LayoutWidget, {
	postCreate: function() {
		this.inherited(arguments);
		
		this.top = new app.widgets.timetable.FilteringSelect({
			region: "top",
			style: {
				height: "50px"
			},
			add: dojo.hitch(this, this.addLesson)
		});
		this.addChild(this.top);
		
		this.left = new app.widgets.timetable.LessonList({
			region: "top",
			style: {
				width: "200px"
			},
			onRemove: dojo.hitch(this, this.removeLesson)
		});
		this.addChild(this.left);
		
		this.center = new app.widgets.timetable.Table({
			region: "center",
		});
		this.addChild(this.center);
		
	},
	
	addLesson: function(item) {
		if (this.left.add(item)) {
		
			dojo.xhrPost({
				url: "server/timetable/VsbTimetable/getData",
				postData:"request=" + dojo.toJson({
					query: {
						code:  item.id
					}
				}),
				handleAs: "json",
				load: dojo.hitch(this, function(data) {
					this.center.addLesson(dojo.mixin(data, {
						lessonId: item.id
					}));
				})
			});
		}
	},
	
	removeLesson: function(item) {
		this.center.removeLesson(item.id);
	}
	
});
