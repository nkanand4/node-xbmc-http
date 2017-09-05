var xbmcApi = require('./main');
var connection;
var specials = {
    'ShowOSDs' : {
    	'noplayer': 'Input.ContextMenu'
    },
    'Ups': {
    	'player': 'Application.IncreaseVolume'
    },
    'Downs': {
    	'player': 'Application.ReduceVolume'
    },
    'Rights': {
        'player': 'Player.Forward'
    },
    'Lefts': {
        'player': 'Player.Rewind'
    },
    'Selects': {
        'player': 'Player.Stop'
    }
};


module.exports = {
    changeDefaults: function() {
        xbmcApi.getInstance('Application').step = 5;
    },
    mute: function () {xbmcApi.invoke('Application.SetVolume', 0);},
    unmute: function () {xbmcApi.invoke('Application.SetVolume', 100);},
    add: function(cmd) {
        var args = [].splice.call(arguments, 0);
        this.changeDefaults();
        try {
            this.fire.apply(this, args);
        }catch(e) {
            // re-request the connection by requiring main.js
            //this.fire.apply(this, args);
        }
    },
    identifyCommand: function(command) {
        var temp = command.split('.');
        var category = temp[0].toLowerCase();
        var name = temp[1];
        return {
            category : category,
            name : name
        };
    },
    fire: function(signal) {
        var self = this;
        var args = [].splice.call(arguments,1);
        command = self.identifyCommand(signal);
        console.log('Doing', command.name, 'on', command.category);
        if (command.name in specials) {
            xbmcApi.invoke('Player.GetActivePlayers', function(data) {
                var specialCommand,
                    condition = data.result.length === 0 ? 'noplayer' : 'player';
                console.log('Got specials one for ', condition);
                if (specials[command.name] && condition in specials[command.name]) {
                    self.add(specials[command.name][condition]);
                }
            });
        }
        try {
            console.log('Invoking...', signal, xbmcApi);
            xbmcApi.invoke.apply(xbmcApi, [signal].concat(args));
        }catch(e) {
            console.log('Error occured', e);
        }
    }
};
