var Connection = require('./Connection');
function Application () {
	var self = this;
	this.invoke = function(name, fn) {
		var data, i, args = [];
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		if(name in this) {
			self[name].apply(this, args);
		}else {
			data = {"method":"Application."+name};
			self._call.apply(this, [data].concat(args));
		}
	};
	
	this.GetProperties = function(names, fn) {
		var properties = [],
			data = {"method":"Application.GetProperties"};
		names.split(',').forEach(function(name) {
			properties.push(name);
		});
		data = self.extend(data, {params: {properties: properties}});
		this._call(data, fn);

	};

	this.SetVolume = function(level, fn) {
		var data = {"method":"Application.SetVolume", "params":{"volume":level}};
		this._call(data, fn);
	};

	this.IncreaseVolume = function(fn) {
		this.GetProperties('volume', function(app) {
			var to;
			console.log('App volume', app.result.volume);
			to = app.result.volume + 1;
			if(to > 100) {
				to = 100;
			}
			self.SetVolume(to, fn);
		});
	};

	this.ReduceVolume = function() {
		this.GetProperties('volume', function(app) {
			var to;
			console.log('App volume', app.result.volume);
			to = app.result.volume - 1;
			if(to < 0) {
				to = 0;
			}
			self.SetVolume(to, fn);
		});
	};
}
Application.prototype = new Connection();

module.exports = Application;