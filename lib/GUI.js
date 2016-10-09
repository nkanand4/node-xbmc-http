/**
 * Created by nitesh on 10/9/16.
 */
var Connection = require('./Connection');

function GUI () {
    var self = this;
    this.ActivateWindow = function (windowName, fn) {
        var data = {"method": "GUI.ActivateWindow"};
        data = self.extend(data, {params: {window: windowName}});
        // doing play pause here
        self._call(data, fn);
    };

    this.showSubtitleWindow = function () {
        self.ActivateWindow('subtitlesearch');
    };

    this.invoke = function(name, fn) {
        var data, i, args = [];
        for(i=1; i<arguments.length; i++) {
            args.push(arguments[i]);
        }
        if(name in this) {
            self[name].apply(this, args);
        }
    };
}

GUI.prototype = new Connection();

module.exports = GUI;
