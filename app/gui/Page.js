dojo.provide("app.gui.Page");
dojo.require("app.config.SiteMap");
dojo.require("app.widgets.Menu");
dojo.require("app.widgets.Notify");
dojo.require("app.gui.HomeScreen");
dojo.require("app.widgets.QuickNewTask");

dojo.require("dojo.hash")

dojo.declare("app.gui.Page", dijit.layout.BorderContainer, {
	region: "center",
	gutters: false,
	style: {
		width: "100%",
		height: "100%"
	},
	liveSplitters: true,
	lastPage: null,

	postCreate: function() {
		app.userStore = new app.JsonStore({
			module: "Users"
		});
		
		app.userStore.fetch({
			onComplete: dojo.hitch(this, function(items) {
				app.user = items[0];
				this.render();
			})
		});
	},
	
	render: function() {
		this.inherited(arguments);

		this.top = new dijit.layout.BorderContainer({
			region: "top",
			style: {
				height: "35px"
			},
			'class': "header"
		});
		
		this.notify = new app.widgets.Notify();
		
		dojo.subscribe("/app/notify/message", dojo.hitch(this, function(title, message) {
			this.notify.notify(new app.widgets.NotifyItem({
				title: title,
				message: message
			}));
		}));
		
// 		dojo.publish("/app/notify/message", ["Ahoj", "Tohle je oznámení"]);
		
		this.logo = new dijit.layout.ContentPane({
			content: "<img src=\"img/logo.png\">",
			region: "left",
			'class': "logo"
		});
		this.top.addChild(this.logo);
		
		this.newTask = new app.widgets.QuickNewTask({
			region: "left",
			layoutPriority: 2,
			style: {
				position: "absolute",
				left: "300px !important",
			}
		});
		this.top.addChild(this.newTask);
		
		this.userInfo = new dijit.layout.ContentPane({
			content: "Přihlášený uživatel: " + app.user.name,
			'class': "userInfo",
			layoutPriority: 1,
			region: "right"
		});
		
		this.top.addChild(this.userInfo);
		
		this.logoutButton = new dijit.form.Button({
			'class': "iconButton logoutButton",
			iconClass: "logout",
			label: "Odhlásit se",
			onClick: function() {
				window.location.href = "server/logout"
			}
		});
		
		this.logoutButton.placeAt(this.userInfo.domNode);
		
		this.menuWrapper = new dijit.layout.BorderContainer({
			style: {
				width: "300px",
// 				'background-color': "white",
// 				height: "100%"
			},
			region: "left"
		});
		
		this.dashboardButton = new dijit.form.Button({
			label: "Dashboard",
			onClick: function() {
				dojo.hash("");
			},
			style: {
				width: "300px"
			},
			region: "top",
			'class': "clearButton",
			iconClass: "dashboard"
		});
		this.menuWrapper.addChild(this.dashboardButton);
		
		
		
		this.menu = new app.widgets.Menu({
			sitemap: app.config.SiteMap,
			region: "center",
			style: {
				width: "300px"
			},
			onItemClick: function(itemId) {
				dojo.hash(dojo.objectToQuery({
					page: itemId.join("/")
				}));
			}
		});
		
		this.addChild(this.top);
		this.menuWrapper.addChild(this.menu);
		
		this.addChild(this.menuWrapper);
		
// 		this.contentLabel = new dijit.layout.ContentPane({
// // 			region: [le"top",
// 			class: "contentLabel"
// 		});
// 		this.addChild(this.contentLabel);
		
		this.content = new dijit.layout.BorderContainer({
			region: "center",
			'class': "contentContainer"
		});
		this.addChild(this.content);

		window.onbeforeunload = function() {
// 			return true;
			
		}

		this.onHashChanged(dojo.queryToObject(dojo.hash()));
		
	},

	startup: function() {
		this.inherited(arguments);

// 		var expl = new dojox.data.StoreExplorer({
// 			region: "center"
// 		});
// 		this.content.addChild(expl);
	},
	
	onHashChanged: function(hash) {
		console.log("hash changed", hash);
		
		if (!hash.page) {
			
			//hash.page = app.config
			//!TODO: default page - overview
// 			return;
			this.contentProvider = new app.gui.HomeScreen();
			
			this.content.addChild(this.contentProvider);
// 			this.lastPage = hash.page;
		}
		
// 		app.config.SiteMap
		
		if (hash.page && this.lastPage != hash.page) {
			this.lastPage = hash.page;
			
			hash.page = hash.page.split("/");
			
			this.menu.setHighlight(hash.page);
			
			console.log("-- change page --", this.lastPage, hash.page);
			//zmena stranky
			var p = hash.page;
			
// 			if (this.content) {
// 				this.removeChild(this.content);
// 				this.content.destroyRecursive();
// 			}
			dojo.forEach(this.content.getChildren(), dojo.hitch(this, function(child) {
				this.content.removeChild(child);
				child.destroyRecursive();
				delete child;
			}));
			
			this.contentProvider = new app.config.SiteMap[p[0]].items[p[1]].page({
				region: "center"
			});
			
			this.content.addChild(this.contentProvider);
			
		}
		
		//prosaknuti zmeny dale
		if (this.contentProvider.onHashChanged) {
			this.contentProvider.onHashChanged(hash);
		}
		
	},
	
	onKeyPress: function(event) {
		if (event.altKey && event.charOrCode == "a") {
			event.stopPropagation();
			this.newTask.show();
			return false;
		}
	}
	
});