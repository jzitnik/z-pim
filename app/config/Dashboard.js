dojo.provide("app.config.Dashboard");

dojo.require("app.widgets.dashboard.Inbox");
dojo.require("app.widgets.dashboard.Tasks");
dojo.require("app.widgets.dashboard.Today");
dojo.require("app.widgets.dashboard.Calendar");

app.config.Dashboard = {
	
	widgets: [],
	availableWidgets: [
		{
			name: "INBOX",
			description: "Počet nepřečtených emailů",
			widget: app.widgets.dashboard.Inbox
			
		},
		{
			name: "Tasks", 
			description: "Krátký výpis úkolů",
			widget: app.widgets.dashboard.Tasks
			
		},
		{
			name: "Today", 
			description: "Výpis dnešních událostí",
			widget: app.widgets.dashboard.Today
			
		},
		{
			name: "Calendar", 
			description: "Kalendář",
			widget: app.widgets.dashboard.Calendar
			
		}
	]
}