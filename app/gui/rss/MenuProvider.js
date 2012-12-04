dojo.provide("app.gui.rss.MenuProvider");

dojo.require("app.widgets.Menu");

dojo.declare("app.gui.rss.MenuProvider", app.widgets._MenuList, {
	
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.store = new app.JsonStore({
			module: "rss/RssSettings"
		});
		
		this.addItem({
			title: "Všechny RSS",
			menuId: null,
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
				menuId: data[i].rss_feed_id,
			});
		}
	},
	
	addItem: function(item) {
		var pthis = this;
		var button = new dijit.form.Button({
			label: item.title,
			menuId: item.menuId,
			onClick: function() {
				app.updateHash({
					page: "rss/viewFeed",
					feedId: this.menuId
				})
			}
		});
		
		this.menuNodes.push(button);
		
		this.menu.addChild(button);
		
	}
	
})
