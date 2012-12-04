dojo.provide("app.gui.settings.EmailSettings"); 

dojo.declare("app.gui.settings.EmailSettings", app.widgets.Container, {
	
	postCreate: function() {
		
		this.imapCont = new dijit.layout.BorderContainer({
			region: "left",
			style: {
				width: "50%"
			}
		});
		
		this.smtpCont = new dijit.layout.BorderContainer({
			region: "center"
		});
		
		this.addChild(this.imapCont);
		this.addChild(this.smtpCont);
		
		this.imapTitle = new dijit.layout.ContentPane({
			region: "top",
			content: "IMAP - příjimání"
		});
		this.imapCont.addChild(this.imapTitle);
		
		
		this.smtpTitle = new dijit.layout.ContentPane({
			region: "top",
			content: "SMTP - odesílání"
		});
		this.smtpCont.addChild(this.smtpTitle);
		
		this.createIMAPForm();
		
		this.createSMTPForm();
		
	},
	
	createIMAPForm: function() {
		
		this.addImapButton = new dijit.form.Button({
			label: "Přidat IMAP účet",
			region: "top",
			onClick: dojo.hitch(this, function() {
				this.imapForm.insertRow();
			}),
			iconClass: "add",
			'class': "iconButton"
		});
		this.imapCont.addChild(this.addImapButton);
		
		this.imapStore = new app.JsonStore({
			module: "mail/ImapSettings"
		});
		
		this.imapForm = new app.widgets.form.DataForm({
			store: this.imapStore,
			region: "center"
		});
		
		this.imapCont.addChild(this.imapForm);
		
	},
	
	createSMTPForm: function() {
		
		this.addSmtpButton = new dijit.form.Button({
			label: "Přidat SMTP účet",
			region: "top",
			onClick: dojo.hitch(this, function() {
				this.smtpForm.insertRow();
			}),
			iconClass: "add",
			'class': "iconButton"
		});
		this.smtpCont.addChild(this.addSmtpButton);
		
		this.smtpStore = new app.JsonStore({
			module: "mail/SmtpSettings"
		});
		
		this.smtpForm = new app.widgets.form.DataForm({
			store: this.smtpStore,
			region: "center"
		});
		
		this.smtpCont.addChild(this.smtpForm);
	}
	
}); 