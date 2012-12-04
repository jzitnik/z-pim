dojo.provide("app.widgets.BigCalendar");
dojo.require("dijit.Calendar")

dojo.declare("app.widgets.BigCalendar", dijit.Calendar, {
// 	templateString: dojo.cache("app.widgets", "templates/BigCalendar.html"),
	getClassForDate: function(date){
// 		if(!(date.getDate() % 10)){ return "blue"; } // apply special style to all days divisible by 10
	}
});
