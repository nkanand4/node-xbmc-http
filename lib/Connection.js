var querystring = require('querystring');
var http = require('http');
var extend = require('node.extend');
var debug = true;

function API() {
	var config = {
		host: 'kodi.media.center',
		port: '8080',
		path: '/jsonrpc',
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		}
	};
	var constt = {"jsonrpc":"2.0", "id":1};
	this.extend = function(a, b) {
		return extend(true, a, b);
	};
	this.getOptions = function connect(data) {
		//config.headers['Content-Length'] = this.format(data).length;
		config = this.extend(config, {
			headers: {
				'Content-Length': this.format(data).length
			}
		});
	  	return config;
	};
    this.send = function request(data, callback) {
    	var self = this;
        var req = http.request(this.getOptions(data), function(res) {
        	var s = '';
        	res.setEncoding('utf8');
        	res.on('data', function(rString) {
        		s += rString;
        	});
        	res.on('end', function(rString) {
        		var json = JSON.parse(s);
        		if(json.error) {
					console.log('Error:', json.error.message, 'Tried:', self.format(data));
        		}
        		console.log('connection close', s);
        		self.callback(callback, json);
        	});
        });
		req.on('error', function(err) {
			console.log('Request erred.');
		});
        console.log('Sending', this.format(data));
        req.write(this.format(data));
        req.end();
    };
    this.format = function(data) {
    	return JSON.stringify(data);
    };

    this._call = function(data, fn) {
		data = this.extend(data, constt);
		this.send(data, fn);
	};

	this.callback = function(fn, data) {
		if(typeof fn === 'function') {
			fn(data);
		}
	};
}

if(debug === false) {
	console.log = function() {};
}

module.exports = API;
