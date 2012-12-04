dojo.provide("app.widgets.Notify");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");
dojo.require("dijit._Templated");

dojo.declare("app.widgets.Notify", [dijit._Widget, dijit._Container], {

	baseClass: "nofityWidget",
	timeout: 5000,
	
	postCreate: function() {
		this.placeAt(document.body);
// 		this.startup();
	},

	destroy: function() {
		this.inherited(arguments);
		
	},

	notify: function(item) {
		var timeout = item.timeout ? item.timeout : this.timeout;
		this.addChild(item);

		dojo.connect(item, "close", this, function() {
			this.closeItem(item)
		});
		
		if (!timeout || item.closeAfterTimeout != true) {
			return;
		}
		
		setTimeout(dojo.hitch({item: item, scope: this}, function() {
			dojo.hitch(this.scope, this.scope.closeItem)(this.item);
		}), timeout);
	},

	closeItem: function(item) {
		dojo.fadeOut({
			node: item.domNode,
			duration: 1000,
			onEnd: dojo.hitch(this, function() {
				dojo.animateProperty({
					node: item.domNode,
					properties: {
						height: 0
					},
					onEnd: dojo.hitch(this, function() {
						this.removeChild(item);
						item.destroy();
						item.onDestroy();
						delete item;
					})
				}).play();
			})
		}).play();
	}

});

dojo.declare("app.widgets.NotifyItem", [dijit._Widget, dijit._Templated], {

	templateString: dojo.cache("app.widgets", "templates/NotifyItem.html"),

	baseClass: "notifyItem",

	closeAfterTimeout: true,

	postCreate: function() {
		this.inherited(arguments);

		dojo.connect(this.titleNode, "onclick", this, function() {
			dojo.hitch(this, this.onTitleClick)();
		});

		dojo.connect(this.closeButton, "onclick", this, function() {
			dojo.hitch(this, this.close)();
		});

		this.titleNode.innerHTML = this.title;
		this.messageNode.innerHTML = this.message;
	},
	   
	onTitleClick: function() {
		dojo.animateProperty({
			node: this.messageNode,
			properties: {
				height: 0
			},
			onEnd: function() {
				dojo.style(this.node, {
					display: "none"
				});
			}
		}).play();
	},

	onDestroy: function() {

	},

	close: function() {

	}
});
