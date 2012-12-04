dojo.provide("app.init");

dojo.require("app.gui.Page");
dojo.require("app.widgets.Helper");

app.init = function(){
 	page = new app.gui.Page();
	
	dojo.subscribe("/dojo/hashchange", page, function(value) {
		page.onHashChanged(dojo.queryToObject(value));
	});
	
	var preloader = dojo.byId("preloader");
	dojo.style(preloader, {
		display: "none"
	});
	
	document.body.appendChild(page.domNode);
	
	dojo.connect(document.body, "onkeypress", page, page.onKeyPress);
	
	dojo.hitch(page, page.startup)();
	
	
	//clippy :-)
	var dimension = dojo.contentBox(document.body);
	var helper = new app.widgets.Helper({
		style: {
			position: "absolute",
			top: (dimension.h - 100) + "px",
			left: (dimension.w - 100) + "px",
			'z-index': 10000
		}
	});
	document.body.appendChild(helper.domNode);
	helper.startup();
	
};

app.updateHash = function(newParam) {
	dojo.hash(dojo.objectToQuery(dojo.mixin(dojo.queryToObject(dojo.hash()), newParam)));
}

app.gui = app.gui || {}
app.gui.getNewPageID = function() {
	var id = (window.app.pages.length) ? window.app.pages.length : 0;
	while (id in window.app.pages) {
		id++;
	}
	return id;
}

//capitals
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

Date.prototype.roundToDays = function() {
		
	date = new Date(this);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	
	return date;
}

app.getSelection = function () {
	if (window.getSelection) {
		return window.getSelection();
	} else if (document.getSelection) {
		return document.getSelection();
	} else if (document.selection) {
		return document.selection.createRange().text;
	}
	return;
}
