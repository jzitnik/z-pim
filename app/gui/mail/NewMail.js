dojo.provide("app.gui.mail.NewMail");

dojo.require("app.JsonStore");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dojox.layout.TableContainer");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Select");

dojo.declare("app.gui.mail.NewMail", dijit.layout.BorderContainer, { 
	
	postCreate: function() {
		
		this.contactsStore = new app.JsonStore({
			module: "ContactsItems"
		});
		
		this.table = new dojox.layout.TableContainer({
			cols: 1,
			region: "top",
			style: {
				width: "50%"
			}
		});
		
		this.smtpStore = new app.JsonStore({
			module: "mail/SmtpSettings",
			getLabelAttributes: function(item) {
				return [item.name];
			}
		});
		
		this.accountInput = new dijit.form.Select({
			store: this.smtpStore,
			label: "SMTP Účet",
			style: {
				width: "100%"
			}
		});
		this.table.addChild(this.accountInput);
		
		this.recipientInput =  new dijit.form.ComboBox({
			searchAttr: "value",
			store: this.contactsStore,
			label: "Příjemce",
			style: {
				width: "100%"
			}
		});
		
		this.subjectInput = new dijit.form.ValidationTextBox({
			title: "Předmět",
			style: {
				width: "100%"
			}
		});
		
		this.table.addChild(this.recipientInput);
		this.table.addChild(this.subjectInput);
		
		this.addChild(this.table);
		
		this.editor = new dijit.Editor({
			region: "center"
		});
		
		this.addChild(this.editor);
		
		this.sendButton = new dijit.form.Button({
			label: "Odeslat",
			region: "bottom",
			'class': "iconButton",
			iconClass: "send",
			onClick: dojo.hitch(this, this.sendMail)
		});
		
		this.addChild(this.sendButton);
	},
	
	sendMail: function() {
		if (!this.recipientInput.validate()) {
			return;
		}
		dojo.xhrPost({
			url: "server/mail/MailMessage/sendMail",
			postData: "request=" + encodeURI(dojo.toJson({
				accountId: this.accountInput.get("value"),
				recipients: [this.recipientInput.get("value")], //!TODO - multiple recipients
				subject: this.subjectInput.get("value"),
				message: this.editor.get("value")
			})).replace(/&/g,'%26').replace(/;/g,'%3B').replace(/\+/g,'%2B'),
			handleAs: "json",
			load: dojo.hitch(this, this.onMailSent),
			error: dojo.hitch(this, this.onError)
		});
	},
	
	onMailSent: function() {
		this.destroyDescendants();
		
		var msg = new dijit.layout.ContentPane({
			content: "<h2>E-Mail byl úspěšně odeslán</h2>",
			region: "center"
		});
		
		this.addChild(msg);
	},
	
	onError: function() {
		alert("chyba při odesílání");
	}
	
});