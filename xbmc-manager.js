var http = require('http');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var restartTracker = 0;
var index;// = fs.readFileSync(process.env.XBMC_REMOTE+'/found.js');
var remote = require('./xbmc-remote');
var ROKU_KEY_MAP = {0:"Input.Back", 2:"Input.Up", 3:"Input.Down",
                        4:"Input.Left", 5:"Input.Right", 6:"Input.Select", 7:"Input.ShowOSD",
                        8:"Player.Rewind", 9:"Player.Forward", 10:"Input.Info", 13:"Player.PlayPause"};
var timer, repeater;

http.createServer(function (req, res) {
  if(/xbmc\/perform/.test(req.url)) {
    var api, params = decodeURIComponent(path.basename(req.url));
    try{
      params = JSON.parse(params);
      api = params.api;
      delete params.api;
      remote.add(api, params);
    }catch(e) {
      console.log('Not a json string');
    }
  }

  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end('var message = "json request acknowledge."');

}).listen(12480);