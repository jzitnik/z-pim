dojo.provide("app.gui.mail.MailMessage");

dojo.require("app.JsonStore");
dojo.require("app.widgets.form.DataForm");
dojo.require("dijit._Widget");

dojo.declare("app.gui.mail.MailMessage", dijit._Widget, {
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "mail/MailMessage"
		});
		
		this.form = new app.widgets.form.DataForm({
			store: this.store,
			query: {
				mail_id: this.mailId,
				folder_id: this.folderId,
				accountId: this.accountId
			}
		});
		this.form.placeAt(this.domNode);
		
	}
	
});
