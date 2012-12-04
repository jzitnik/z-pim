dojo.provide("app.ForestStoreModel");
dojo.require("dijit.tree.ForestStoreModel");
dojo.declare("app.ForestStoreModel", dijit.tree.ForestStoreModel, {
	parentField: "root_id",
	
	getChildren: function(parentItem, complete_cb, error_cb) {
		if (parentItem.root == true) {
			// get top level nodes for this plugin id 
			root_id = 0;
		}
		else {
			root_id = this.store.getIdentity(parentItem);
		}
		
		if (this.store.isItemLoaded(parentItem)) {
			this.store.loadItem({
				item: parentItem,
				onItem: complete_cb
			});
		} else {
			var query = dojo.mixin({}, this.query);
			query[this.parentField] = root_id;
			this.store.fetch({
				query: query, 
				onComplete: complete_cb, 
				onError: error_cb
			});
		}
		// Call superclasses' getChildren
// 		return this.inherited(arguments);
	},
	
	mayHaveChildren: function(/*dojo.data.Item*/ item){
		// summary:
		//		Tells if an item has or may have children.  Implementing logic here
		//		avoids showing +/- expando icon for nodes that we know don't have children.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
		// tags:
		//		extension
		return item === this.root || dojo.some(this.childrenAttrs, function(attr){
			if (this.store.hasAttribute(item, attr) && (this.store.getValue(item, attr).length > 0 || this.store.getValue(item, attr) > 0)) {
				return true;
			} else {
				return false;
			}
		}, this);
	},
}); 
