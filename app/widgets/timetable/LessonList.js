dojo.provide("app.widgets.timetable.LessonList");

dojo.declare("app.widgets.timetable._LessonWidget", dijit._Widget, {
	
	style: {
		border: "1px solid black",
		padding: "2px 5px 2px 5px",
		margin: "2px 5px 2px 5px",
		position: "relative",
		display: "inline-block"
	},
	
	postCreate: function() {
		this.inherited(arguments);
		
		this.labelDiv = dojo.create("div", {
			innerHTML: this.label,
		        
		});
		
		this.removeButton = new dijit.form.Button({
			label: "X",
			onClick: dojo.hitch(this, function() {
				this.remove(this);
			}),
			style: {
				position: "absolute",
				right: "0px",
				top: "0px"
			}
			
		});
		
		dojo.place(this.labelDiv, this.domNode);
		this.removeButton.placeAt(this.domNode);
	},
	
	remove: function(instance) {
		
	}
});

dojo.declare("app.widgets.timetable.LessonList", dijit._Widget, {
	
	items: {},
	
	add: function(item) {
		if (item.id in this.items) {
			return false;
		}
		
		var lesson = new app.widgets.timetable._LessonWidget({
			label: item.name,
			value: item,
			remove: dojo.hitch(this, function(widget) {
				this.removeChild(widget);
// 				var index = this.items.indexOf(widget.item);
				delete this.items[widget.value.id];
				widget.destroyRecursive();
				this.onRemove(widget.value);
			})
		})
// 		this.addChild(lesson);
		lesson.placeAt(this.domNode);
		
		this.items[item.id] = item;
		return true;
	},
	
	onRemove: function(item) {
		
	}
});
