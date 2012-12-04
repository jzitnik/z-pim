dojo.provide("app.widgets.MailMessage"); 

dojo.require("dijit._Widget");

dojo.declare("app.widgets.MailMessage", dijit._Widget, {
	
	postCreate: function() {
		
	},
	
	set: function(name, value) {
		if (name == "value") {
			console.log("MAIL MSG", value);
			
			var contents = []
			for (var i in value) {
				contents.push(value[i].content);
			}
			
			var join = "<hr class=\"menuWidget\" />";
			
			this.domNode.innerHTML = contents.join(join);
			
			return value;
		}
		return this.inherited(arguments);
	}
	
}); 
