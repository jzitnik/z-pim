dojo.provide("app.gui.mail.MailBrowser");

dojo.require("app.ForestStoreModel");
dojo.require("dijit.Tree");
dojo.require("dijit.tree.ForestStoreModel");
dojo.require("app.gui.mail.MailMessage");

dojo.declare("app.gui.mail.MailBrowser", app.widgets.Container, {
	
	postCreate: function() {
		
		this.accountId = dojo.queryToObject(dojo.hash()).accountId;
		
		console.log("ACCOUNT ID", this.accountId);
		
		this.left = new dijit.layout.BorderContainer({
			region: "left",
			style: {
				width: "20%"
			},
			splitter: true
		});
		
		this.folderStore = new app.JsonStore({
			module: "mail/FolderTree"
		});
		
		this.treeModel = new app.ForestStoreModel({
			store: this.folderStore,
			childrenAttrs: ["folders"],
			query: {
				accountId: this.accountId
			},
			parentField: "folder_id",
			getChildren: function(parentItem, complete_cb, error_cb) {
				if (parentItem.root == true) {
					var query = dojo.mixin({}, this.query);
					this.store.fetch({
						query: query, 
						onComplete: complete_cb, 
						onError: error_cb
					});
				} else {
					complete_cb(parentItem.folders);
				}
			},
			
		});
		
		this.foldersTree = new dijit.Tree({
			showRoot: false,
			model: this.treeModel,
			region: "center",
			onClick: function(item) {
				if(!item){
					return;
				}
				
				var hashParam = {};
				hashParam.folderId = item.folder_id;
				hashParam.mailId = undefined;
				app.updateHash(hashParam);
			}
		});
		
		this.left.addChild(this.foldersTree);
		
		this.addChild(this.left);
		//---------------------PROHLIZEC MAILU----------------------------------------------------
		
		this.mailView = new dijit.layout.BorderContainer({
			region: "center"
		});
		
		this.mailStore = new app.JsonStore({
			module: "mail/MailList"
		});
		
		var tableHeader = 
		[
 				{field: 'sender', name: 'Odesílatel', width: '30%'},
				{field: 'subject', name: 'Předmět', width: '50%'},
				{field: 'date', name: 'Datum odeslání', width: '20%', formatter: function(date) {
					var d = new Date(date);
					return dojo.date.locale.format(d, {selector: 'date', formatLength: 'long'});
				}}
		];
		
		this.mailList = new dojox.grid.DataGrid({
			structure: tableHeader,
 			region: "center",
			minSize: 20,
			splitter: true,
			store: this.mailStore,
			style: {
				height: "50%"
			},
			query: {
				accountId: this.accountId
			},
			onRowClick: dojo.hitch(this, this.onGridClick),
			style: "height: 150px;"
		});
		
		
		this.message = new dijit.layout.BorderContainer({
			region: "bottom",
			splitter: true,
			style: {
				height: "50%"
			}
		});

		this.mailView.addChild(this.mailList);
		this.mailView.addChild(this.message);
		
		this.addChild(this.mailView);
		
	},
	     
	
	onHashChanged: function(hash) {
		
		if (hash.accountId) {
			var qry = {
				accountId: this.accountId
			}
			
			this.treeModel.query = qry;
			
			//this.mailList.setQuery(qry);
			
			
		}
		
		
		if (!this.mailList.query || hash.folderId != this.mailList.query.folder_id || hash.folderId != this.folderId) {
			this.mailList.setQuery({
				folder_id: hash.folderId,
				accountId: this.accountId
			});
		}
		
		this.accountId = hash.accountId;
		
		if (hash.mailId) {
			if (this.mailMessage) {
				this.message.removeChild(this.mailMessage);
				this.mailMessage.destroyRecursive();
			}
			
			this.mailMessage = new app.gui.mail.MailMessage({
				folderId: hash.folderId ? hash.folderId : "INBOX",
				mailId: hash.mailId,
				region: "center",
				accountId: this.accountId
			});
			
			this.message.addChild(this.mailMessage);
		}
	},
	
	
	onGridClick: function(event) {
		var rowData = this.mailList.getItem(event.rowIndex);
		
		app.updateHash({
			mailId: rowData.mail_id
		});
		
	}
}); 
