dojo.provide("app.Synchronize");

dojo.declare("app.Synchronize", null, {
	
	webSocket: null,
	_topics: [],
	connectErrors: 0,
	
	constructor: function(args) {
		dojo.mixin(this, args);
		
		this.bindTopics();
		
		this.connect();
	},
	
	connect: function() {
		this.webSocket = new WebSocket(this.webSocketUrl);
		this.webSocket.onopen = dojo.hitch(this, function() {
			if (this.webSocket.readyState == 1) {
				console.log("--INIT WEBSOCKET--");
				this.onSocketOpen();
			}
		});
		this.webSocket.onerror = dojo.hitch(this, function() {
			this.onSocketError();
			this.reconnect();
		});
		this.webSocket.onclose = dojo.hitch(this, function() {
			this.onSocketClose();
			this.reconnect();
		});
		this.webSocket.onmessage = dojo.hitch(this, function(msg) {
			this.onMessage(dojo.fromJson(msg.data));
		});
	},
	
	bindTopics: function() {
		this._topics.push(dojo.subscribe("/lblib/server/send", this, function(data) {
			console.log("WEBSOCKET SEND", data);
			var result = this.webSocket.send(dojo.toJson(data));
		}));
	},
	
	onMessage: function(data) {

		console.log("WS DATA", data);
		if (data.action && data.module)
		switch (data.action) {
			case "update":
				console.log("SOCKET UPDATE", data);
				dojo.publish("/app/sync/onUpdate", [data.module, data.data]);
			break;
			case "delete":
				console.log("SOCKET DELETE", data);
				dojo.publish("/app/sync/onDelete", [data.module, data.data]);
			break;
			case "insert":
				console.log("SOCKET INSERT", data);
				dojo.publish("/app/sync/onInsert", [data.module, data.data]);
			break;
		}
	},
	
	
	onSocketError: function() {
		
	},
	
	onSocketClose: function() {
		
	},
	
	onSocketOpen: function() {
		
	},
	
	reconnect: function() {
		this.webSocket.close();
		
		delete this.webSocket;
		
		this.connectErrors++;
		this.connect();
	}
}); 
