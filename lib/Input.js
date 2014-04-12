var Connection = require('./Connection');
var extend = require('node.extend');
function Input () {
	var self = this;
  var getDefaultData = function(name) {
      return {"method":"Input."+name};
  };
  this.SendText = function(text, fn) {
    self.bypassSendText({
      params: {
        text: text
      }
    }, fn);
  }

	this.invoke = function(name, fn, data) {
		var i, args = [];
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		if(name in this) {
			self[name].apply(this, args);
		}else {
			self._call.apply(this, [getDefaultData(name)].concat(args));
		}
	};

  this.bypassSendText = function(params, fn) {
    data = extend(true, params, getDefaultData('SendText'));
    self._call(data, fn);
  }
}
Input.prototype = new Connection();

module.exports = Input;