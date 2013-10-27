var connection = require('./Connection');
function Player () {
	var self = this;
	this.PlayPause = function(fn) {
		var data = {"method":"Player.PlayPause"};
		this.invoke('GetActivePlayers', function(info) {
			delete info.result[0].type;
			data = self.extend(data, {params: info.result[0]});
			// doing play pause here
			self._call(data, fn);
		});
	};

	this.SetSpeed = function(fn, direction) {
		var data = {"method":"Player.SetSpeed"};
		console.log('sent direction is', direction);
		this.invoke('GetActivePlayers', function(info) {
			var params;
			direction = direction === 'forward' ? 'increment' : 'decrement';
			console.log('direction is', direction);
			delete info.result[0].type;
			params = self.extend(info.result[0], {speed: direction});
			data = self.extend(data, {params: params});
			// doing setspeed here
			self._call(data, fn);
		});
	};

	this.Rewind = function(fn) {
		this.SetSpeed(fn, 'reverse');
	};

	this.Forward = function(fn) {
		this.SetSpeed(fn, 'forward');
	};

	this.invoke = function(name, fn) {
		var data, i, args = [];
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		if(name in this) {
			self[name].apply(this, args);
		}else {
			data = {"method":"Player."+name};
			self._call.apply(this, [data].concat(args));
		}
	};
}
Player.prototype = new connection();

module.exports = Player;