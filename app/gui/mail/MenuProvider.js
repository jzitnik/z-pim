dojo.provide("app.gui.mail.MenuProvider");

dojo.require("app.widgets.Menu");

dojo.declare("app.gui.mail.MenuProvider", app.widgets._MenuList, {
	
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "mail/ImapSettings"
		});
		
		this.addItem({
			title: "Napsat E-Mail",
			page: "mails/newMail"
		});
		
		this.store.fetch({
			onComplete: dojo.hitch(this, this.fillFeeds),
			query: {}
		});
	},
	
	fillFeeds: function(data) {
		console.log("DATAS", data);
		for (var i in data) {
			this.addItem({
				title: data[i].name,
				page: "mails/mailBrowser",
				accountId: data[i].imap_account_id
			});
		}
	},
	
	addItem: function(item) {
		var pthis = this;
		var button = new dijit.form.Button({
			label: item.title,
			page: item.page,
			accountId: item.accountId,
			onClick: function() {
				var args = {
					page: this.page
				}
				
				if (this.accountId) {
					args.accountId = this.accountId;
				}
				
				app.updateHash(args);
			}
		});
		
		this.menuNodes.push(button);
		
		this.menu.addChild(button);
		
	}
	
})
