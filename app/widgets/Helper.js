dojo.provide("app.widgets.Helper");

dojo.require("dijit.TooltipDialog");
dojo.require("dijit.popup");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.Editor");
dojo.require("dijit._HasDropDown");
dojo.require("dijit._TemplatedMixin");
dojo.require("dijit._Widget");


dojo.declare("app.widgets.Helper", [dijit._Widget, dijit._TemplatedMixin, dijit._HasDropDown], {
	
	templateString: "<div><img src=\"img/clip.png\"></div>",
	
	postCreate: function() {
		this.dnd = new dojo.dnd.Moveable(this.domNode);
		this.tooltipContainer = new dijit.layout._LayoutWidget({
		});
		
		this.tooltipContainer.addChild(new dijit.layout.ContentPane({
			content: "Máte návrh na zlepšení?",
			'class': "bold"
		}));
		
		this.editor = new dijit.Editor();
		
		this.tooltipContainer.addChild(this.editor);
		
		this.tooltipContainer.addChild(new dijit.form.Button({
			label: "Odeslat",
			onClick: dojo.hitch(this, this.send)
		}));
		
		this.message = new dijit.layout.ContentPane({
			content: "",
			'class': "bold"
		})
		
		this.tooltipContainer.addChild(this.message);
		
		this.tooltip = new dijit.TooltipDialog({
			content: this.tooltipContainer,
			closable: true,
			onBlur: dojo.hitch(this, function() {
				this.closeDropDown();
			}),
			onOpen: dojo.hitch(this, function() {
				this.editor.focus();
				console.log("editor focus");
			}),
		});
		this.dropDown = this.tooltip;
		this.inherited(arguments);
	},
	
	send: function() {
		dojo.xhrPost({
			url: "server/Helper/send",
			postData: "request=" + encodeURI(dojo.toJson({
				message: this.editor.get("value")
			})).replace(/&/g,'%26').replace(/;/g,'%3B').replace(/\+/g,'%2B'),
			handleAs: "json",
			load: dojo.hitch(this, this.onMailSent),
			error: dojo.hitch(this, this.onError)
		});
	},
	
	onMailSent: function() {
		this.closeDropDown();
		this.editor.set("value", "");
		this.message.set("content", "");
	},
	
	onError: function() {
		this.message.set("content", "Chyba při odesílání");
	},
	
});
