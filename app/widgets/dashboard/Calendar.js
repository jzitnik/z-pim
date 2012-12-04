dojo.provide("app.widgets.dashboard.Calendar"); 

dojo.require("dojox.widget.Portlet");
dojo.require("app.gui.calendar.ViewCalendar");

dojo.declare("app.widgets.dashboard.Calendar", dojox.widget.Portlet, {
	
	title: "Kalendář",
	closable: true,
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.calendar = new app.gui.calendar.ViewCalendar({
			onCalendarRender: dojo.hitch(this, function() {
				this.addChild(this.calendar.calendar);
			})
		});
// 		this.addChild(this.calendar);
		
	}
	
});