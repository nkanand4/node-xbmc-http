var Connection = require('./Connection');
function Input () {
	var self = this;
	this.invoke = function(name, fn) {
		var data, i, args = [];
		for(i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}
		if(name in this) {
			self[name].apply(this, args);
		}else {
			data = {"method":"Input."+name};
			self._call.apply(this, [data].concat(args));
		}
	};
}
Input.prototype = new Connection();

module.exports = Input;