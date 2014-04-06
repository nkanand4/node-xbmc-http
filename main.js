var modules = ['Player', 'Input', 'Application'];
var instances = {};

modules.forEach(function(module) {
	var instance = require('./lib/'+module);
	instances[module] = new instance;
});

var remote = {
	invoke: function(command) {
		var split = command.split('.');
		var category = split[0];
		var name = split[1];
		var i, args = [];
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		// example: invoking Player.invoke('PlayPause', arguments);
		instances[category].invoke.apply(instances[category], [name].concat(args));
	},
	getInstance: function(name) {
		if(name in instances) {
			return instances[name];
		}else {
			console.log('Instance ', name,' not found');
			return undefined;
		}
	}
};

/*
remote.invoke('Application.IncreaseVolume', function(data) {
	if(typeof data.error === 'undefined') {
		console.log('I can change volume', data);
	}
});
//remote.invoke('Player.Seek', {hours: 1, minutes: 10, seconds: 10});
//*/

module.exports = remote;