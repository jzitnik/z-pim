dojo.provide("app.widgets.QuickNewTask");

dojo.require("dijit._Widget");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.Button");

dojo.declare("app.widgets.QuickNewTask", dijit._Widget, {
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "Tasks"
		});
		
		this.nameInput = new dijit.form.ValidationTextBox({
			required: true,
			style: {
// 				height: "30px !important",
				padding: "2px 0 5px 0",
				'margin-top': "3px",
				'margin-right': "5px",
				width: "350px",
				outline: "1px solid black"
			},
			onKeyPress: dojo.hitch(this, function(event) {
				if (event.charOrCode == dojo.keys.ENTER) {
					event.stopPropagation();
					this.save();
					return false;
				}
			})
		});
		
		this.nameInput.placeAt(this.domNode);
		
		this.saveButton = new dijit.form.Button({
			label: "Vytvořit úkol",
			onClick: dojo.hitch(this, this.save)
		});
		this.saveButton.placeAt(this.domNode);
		
		
// 		dojo.style(this.domNode, {
// 			opacity: 0
// 		});
	},
	
	show: function() {
		dojo.fadeIn({
			node: this.domNode
		}).play();
	},
	
	hide: function(callback) {
		dojo.fadeOut({
			node: this.domNode,
			onEnd: callback
		}).play();
	},
	
	save: function() {
		if (!this.nameInput.validate()) {
			return;
		}
		
		this.store.newItem({
			name: this.nameInput.get("value")
		});

		this.store.save({
			onComplete: dojo.hitch(this, function() {
				var message = dojo.create("div", {
					'class': "quickNewTaskMessage",
					style: {
						opacity: 0
					},
					innerHTML: "Úkoly byl uložen"
				});
				dojo.place(message, this.domNode);
				this.nameInput.set("value", "");
				dojo.fadeIn({
					node: message,
					duration: 1000,
					onEnd: dojo.hitch(this, function() {
						setTimeout(dojo.hitch(this, function() {
// 							this.hide(function() {
								dojo.destroy(message);
// 							});
						}), 3000);
					})
				}).play();
			})
		})
	}
	
});
