var modules = ['Player', 'Input'];
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
	}
};

/*remote.invoke('Input.Right', function(data) {
	if(typeof data.error === 'undefined') {
		console.log('I can forward', data);
	}
});*/

module.exports = remote;