dojo.provide("app.Types");

dojo.require("dijit.form.NumberSpinner");
dojo.require("app.widgets.FormValueViewer");
dojo.require("app.widgets.LabelSelector");
dojo.require("app.widgets.DateTimeTextBox");
dojo.require("app.widgets.MailMessage");

dojo.require("app.widgets.Color");

dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Select");
dojo.require("dojox.widget.ColorPicker");
dojo.require("dijit.Editor");

app.Types = {
	Integer: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: dijit.form.NumberSpinner
	},
	String: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: dijit.form.TextBox
	},
	Password: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: dojo.declare("app.Types.Password.editWidget", dijit.form.TextBox, {
			type: "password"
		})
	},
	Label: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: app.widgets.LabelSelector,
	},
	Date: {
		staticWidget: app.widgets.FormDateViewer,
		editWidget: dijit.form.DateTextBox,
		decode: function(value) {
			return new Date(value);
		},
		encode: function(value) {
			return value.toISOString();
		}
	},
	DateTime: {
		staticWidget: app.widgets.FormDateViewer,
		editWidget: app.widgets.DateTimeTextBox,
		decode: function(value) {
			return new Date(value);
		},
		encode: function(value) {
			return value.toISOString();
		}
	},
	Boolean: {
		staticWidget: app.widgets.FormBooelanViewer,
		editWidget: dijit.form.CheckBox
	},
	HTML: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: dijit.Editor
	},
	UserRole: {
		staticWidget: app.widgets.FormValueViewer,
		editWidget: dojo.declare("app.Types.UserRole.editWidget", dijit.form.Select, {
			options: [
				{ label: 'Uživatel', value: 'user' },
				{ label: 'Administrátor', value: 'admin'},
			]
		})
	},
	EmailMessage: {
		staticWidget: app.widgets.MailMessage,
		editWidget: app.widgets.MailMessage
	},
	Color: {
		staticWidget: app.widgets.ColorViewer,
		editWidget: dojox.widget.ColorPicker
	}
}
