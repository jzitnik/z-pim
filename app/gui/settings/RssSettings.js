dojo.provide("app.gui.settings.RssSettings"); 

dojo.declare("app.gui.settings.RssSettings", app.widgets.Container, {
	
	postCreate: function() {
		
		this.feedsCont = new dijit.layout.BorderContainer({
			region: "left",
			style: {
				width: "50%"
			}
		});
		
				
		this.addChild(this.feedsCont);
		
		this.feedsTitle = new dijit.layout.ContentPane({
			region: "top",
			content: "RSS feedy"
		});
		this.feedsCont.addChild(this.feedsTitle);
		
		this.createForm();
		
	},
	
	createForm: function() {
		
		this.addFeedButton = new dijit.form.Button({
			label: "Přidat RSS feed",
			region: "top",
			onClick: dojo.hitch(this, function() {
				this.feedsForm.insertRow();
			}),
			iconClass: "add",
			'class': "iconButton"
		});
		this.feedsCont.addChild(this.addFeedButton);
		
		this.feedsStore = new app.JsonStore({
			module: "rss/RssSettings"
		});
		
		this.feedsForm = new app.widgets.form.DataForm({
			store: this.feedsStore,
			region: "center"
		});
		
		this.feedsCont.addChild(this.feedsForm);
		
	},
	
}); 