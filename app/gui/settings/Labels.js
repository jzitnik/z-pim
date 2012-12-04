dojo.provide("app.gui.settings.Labels"); 

dojo.declare("app.gui.settings.Labels", app.widgets.Container, {
	
	postCreate: function() {
		
		this.addLabelButton = new dijit.form.Button({
			label: "Přidat štítek",
			region: "top",
			onClick: dojo.hitch(this, function() {
				this.LabelForm.insertRow();
			}),
			iconClass: "add",
			'class': "iconButton"
		});
		this.addChild(this.addLabelButton);
		
		this.labelStore = new app.JsonStore({
			module: "Labels"
		});
		
		this.labelForm = new app.widgets.form.DataForm({
			store: this.labelStore,
			region: "center"
		});
		
		this.addChild(this.labelForm);
		
	},

	
}); 