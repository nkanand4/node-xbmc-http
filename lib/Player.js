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

        this.Stop = function(fn) {
                var data = {"method":"Player.Stop"};
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

/*
* Adding seeking capability
*   Supporting enums/time documented at http://wiki.xbmc.org/?title=JSON-RPC_API/v6#Player.Seek
* 	Player.Seek('smallbackward');
*	Player.Seek('bigforward');
*	Player.Seek({hours: 1, minutes: 10, seconds: 10});
*/

	this.Seek = function(label, fn) {
		console.log('Seek arg preparation', arguments);
		var data = {"method":"Player.Seek"};
		var additionalData = {};
		fn = fn || function() {};
		if(typeof label === 'object') {
			additionalData.value = {
                "hours": parseInt(label.hours,10),
                "minutes": parseInt(label.minutes, 10),
                "seconds": parseInt(label.seconds,10)
            };
		}else if(typeof label === 'string'){
			additionalData.value = label;
		}

		this.invoke('GetActivePlayers', function(info) {
      if(info.result.length > 0) {
        delete info.result[0].type;
        self.extend(info.result[0], additionalData);
        data = self.extend(data, {
          params: info.result[0],
        });
        // doing seek here
        self._call(data, fn);
      }else {
        console.log('No active players');
      }
		});
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
