dojo.provide("app.gui.calendar.WeekView");

dojo.require("app.widgets.WeekCalendar");

dojo.declare("app.gui.calendar.WeekView", app.widgets.Container, {
	
	
	postCreate: function() {
		
		
		
		this.weekView = new app.widgets.WeekCalendar({
			region: "center"
		});
		
		this.addChild(this.weekView);
	}
	
});