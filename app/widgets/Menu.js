dojo.provide("app.widgets.Menu");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.StackController");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit._Templated");

dojo.declare("app.widgets._MenuList", [dijit._Widget], {

	menuNodes: [],
	menuWidget: null,
	postCreate: function() {
		this.inherited(arguments);
		
		this.menu = new dijit.layout._LayoutWidget({
			style: {
				height: "50%"
			}
		});
		this.menu.placeAt(this.domNode);
		
		if (this.menuWidget) {
			dojo.place(dojo.create("hr", {
				'class': "menuWidget"
			}), this.domNode);
			
			this.widget = new this.menuWidget();
			
			this.widget.placeAt(this.domNode);
		}
	},

	addItem: function(item) {
		var pthis = this;
		var button = new dijit.form.Button({
			label: item.title,
			menuId: item.menuId,
			onClick: function() {
				pthis.onItemClick(this.menuId);
			}
		});
		
		this.menuNodes.push(button);

		this.menu.addChild(button);
		
	},
	
	onItemClick: function() {
		
	}
	
});

dojo.declare("app.widgets.Menu", [dijit.layout.TabContainer/*, dijit._Templated*/], {
	tabPosition: "left",
	'class': "mainMenu",
	tabStrip: true,
	menuItems: [],
	controllerWidget: "app.widgets._MenuTabController",
	
	postCreate: function() {
		this.inherited(arguments);
		
		if (!this.sitemap) {
			return;
		}
		
		for (var main in this.sitemap) {
			var tabId = main;
			
			var menuProvider = app.widgets._MenuList;
			
			if (this.sitemap[main].menuProvider) {
				menuProvider = this.sitemap[main].menuProvider;
			}
			
			var menuArgs = {
				title: this.sitemap[main].title,
				onItemClick: this.onItemClick,
				iconClass: main,
				style: {
					height: "100%"
				},
				menuId: main
			}
			
			if (this.sitemap[main].menuWidget) {
				menuArgs.menuWidget = this.sitemap[main].menuWidget;
			}
			
			var menuList = new menuProvider(menuArgs);
			for (var item in this.sitemap[main].items) {
				
				if (!this.sitemap[main].items[item].title) {
					continue;
				}
				
				var listId = [main, item];
				
				dojo.mixin(this.sitemap[main].items[item], {
					menuId: listId
				});
				
				menuList.addItem(this.sitemap[main].items[item]);
			}
			
			this.menuItems.push(menuList);
			
			this.addChild(menuList);
		}
	},
	
	onItemClick: function(itemId) {
		
	},
	
	setHighlight: function(pageArray) {
		for (var i in this.menuItems) {
			if (this.menuItems[i].menuId == pageArray[0]) {
				this.selectChild(this.menuItems[i]);
			}
		}
	}
	
});


dojo.declare("app.widgets._MenuTabButton", dijit.layout._TabButton, {
	// summary:
	//		A tab (the thing you click to select a pane).
	// description:
	//		Contains the title of the pane, and optionally a close-button to destroy the pane.
	//		This is an internal widget and should not be instantiated directly.
	// tags:
	//		private

	// baseClass: String
	//		The CSS class applied to the domNode.
	baseClass: "dijitTab menuTabButton",

	templateString:  dojo.cache("app.widgets", "templates/_TabButton.html"),
	

});

dojo.declare("app.widgets._MenuTabController", dijit.layout.TabController, {
	buttonWidget: app.widgets._MenuTabButton
});

