dojo.provide("app.gui.rss.Reader");

dojo.declare("app.gui.rss.Reader", app.widgets.Container, {
	
	postCreate: function() {
		
		this.store = new app.JsonStore({
			module: "rss/Feed"
		});
		
		var feed_id = dojo.hash().feed_id;
		
		this.viewer = new app.widgets.form.DataForm({
			store: this.store,
			region: "center",
			query: {
				feed_id: feed_id
			},
			onFieldStartup: function(field) {
				field.title_field.href = field.data.link;
				field.title_field.target = "_blank";
			}
		});
		
		this.addChild(this.viewer);
		
	},
	
	onHashChanged: function(hash) {
		this.viewer.setQuery({
			feed_id: hash.feedId
		});
	}
	
});
