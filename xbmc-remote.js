var xbmcApi = require('./main');
var connection;
var queue = [];
var specials = {
    'ShowOSD' : {
    	'noplayer': 'Input.ContextMenu'
    },
    'Up': {
    	'player': 'Application.IncreaseVolume'
    },
    'Down': {
    	'player': 'Application.ReduceVolume'
    }
};


module.exports = {
    changeDefaults: function(xbmcApi) {
        //xbmcApi.application.defaults.stepVol = 10;
    },
    add: function(cmd) {
        this.fire(cmd);
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
        command = self.identifyCommand(signal);
        console.log('Doing', command.name, 'on', command.category);
        if (command.name in specials) {
            xbmcApi.invoke('Player.GetActivePlayers', function(data) {
                var specialCommand
                    condition = data.result.length === 0 ? 'noplayer' : 'player';
                console.log('Got specials one for ', condition);
                if (specials[command.name][condition]) {
                    self.add(specials[command.name][condition]);
                }
            });
        }
        xbmcApi.invoke(signal);
    }
};