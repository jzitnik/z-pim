dojo.provide("app.config.SiteMap");

// dojo.require("app.gui.Overview");
dojo.require("app.gui.calendar.ViewCalendar");
dojo.require("app.gui.calendar.NewTask");
dojo.require("app.gui.calendar.Tasks");
dojo.require("app.gui.calendar.WeekView");
dojo.require("app.gui.calendar.MonthView");

dojo.require("app.gui.notes.NewNote");
dojo.require("app.gui.notes.ViewNotes");
dojo.require("app.widgets.LabelsView");

dojo.require("app.gui.contacts.NewContact");
dojo.require("app.gui.contacts.ViewContacts");

dojo.require("app.gui.settings.AccountSettings");
dojo.require("app.gui.settings.EmailSettings");
dojo.require("app.gui.settings.RssSettings");
dojo.require("app.gui.settings.Users");
dojo.require("app.gui.settings.AddUser");
dojo.require("app.gui.settings.Labels");

dojo.require("app.gui.rss.Reader");
dojo.require("app.gui.rss.MenuProvider");

dojo.require("app.gui.mail.MailBrowser");
dojo.require("app.gui.mail.NewMail");
dojo.require("app.gui.mail.MenuProvider");

dojo.require("app.gui.tools.VsbTimetable");


app.config.SiteMap = {
	
	calendar: {
		order: 0,
		title: "Kalendář & úkoly",
		items: {
			newTask: {
				page: app.gui.calendar.NewTask,
				title: "Naplánovat událost",
				description: "Vytvořít nový záznam v kalendáři"
			},
			viewCalendar: {
				page: app.gui.calendar.ViewCalendar,
				title: "Denní pohled",
				description: "Zobrazit kalendář s úkoly v jednotlivých dnech"
			},
			weekView: {
				page: app.gui.calendar.WeekView,
				title: "Týdenní pohled",
				description: "Zobrazit úkoly v jednotlivých dnech"
			},
			monthView: {
				page: app.gui.calendar.MonthView,
				title: "Měsíční pohled",
				description: "Zobrazit úkoly v měsíci"
			},
			summary: {
				page: app.gui.calendar.Tasks,
				title: "Seznam úkolů"
			},
			
			//temporary section
			timetable: {
				page: app.gui.tools.VsbTimetable,
				title: "Designer rozvrhu"
			}
		},
		menuWidget: dojo.declare("app.config.SiteMap", app.widgets.LabelsView, {
			onChange: function(labels) {
				app.updateHash({
					labels: labels
				});
			}
		})
	},

	notes: {
		order: 1,
		title: "Poznámky",
		items: {
			newNote: {
				page: app.gui.notes.NewNote,
				title: "Nová poznámka",
			},
			viewNotes: {
				page: app.gui.notes.ViewNotes,
				title: "Poznámky",
			},
		},
		menuWidget: dojo.declare("app.config.SiteMap", app.widgets.LabelsView, {
			onChange: function(labels) {
				app.updateHash({
					labels: labels
				});
			}
		})
	},

	settings: {
		title: "Nastavení",
		order: 4,
		items: {
			accountSettings: {
				title: "Nastavení účtu",
				page: app.gui.settings.AccountSettings,
			},
			labels: {
				title: "Nastavení štítků",
				page: app.gui.settings.Labels
			},
			users: {
				title: "Uživatelé",
				page: app.gui.settings.Users
			},
			addUser: {
				title: "Přidat uživatele",
				page: app.gui.settings.AddUser
			},
			mailSettings: {
				title: "Nastavení emailu",
				page: app.gui.settings.EmailSettings
			},
			rssSetings: {
				title: "Nastavení RSS",
				page: app.gui.settings.RssSettings
			},
		}
	},

	contacts: {
		order: 2,
		title: "Kontakty",
		items: {
			newContact: {
				page: app.gui.contacts.NewContact,
				title: "Nový kontakt",
			},
			viewContacts: {
				page: app.gui.contacts.ViewContacts,
				title: "Seznam kontaktů",
			},
		}
	},

	mails: {
		title: "E-Maily",
		order: 3,
		menuProvider: app.gui.mail.MenuProvider,
		items: {
			mailBrowser: {
				page: app.gui.mail.MailBrowser,
// 				title: "Prohlížení",
			},
			newMail: {
				page: app.gui.mail.NewMail,
// 				title: "Napsat E-Mail",
			},
		}
	},
	
	rss: {
		title: "RSS",
		order: 4,
		menuProvider: app.gui.rss.MenuProvider,
		items: {
			viewFeed: {
				page: app.gui.rss.Reader,
			},
		}
		
	}
}

//no padding and margin
dojo.extend(dijit.layout.BorderContainer, {
	gutters: false,
});
