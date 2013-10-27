var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var index = fs.readFileSync('/home/nitesh/Developer/workspace/xbmc-manager/found.js');
var ROKU_KEY_MAP = {100:"Input.Back",102:"Input.Up",103:"Input.Down",
                        104:"Input.Left",105:"Input.Right",106:"Input.Select",107:"Input.ShowOSD",
                        108:"Player.Rewind",109:"Player.Forward",110:"Input.Info",113:"Player.PlayPause"};
var remote = require('./xbmc-remote');

http.createServer(function (req, res) {
  var v1;
  if(/pingcheck/.test(req.url)) {
    exec('sh /home/nitesh/scripts/xbmcstarter');
  }
  if(/shutdown/.test(req.url)) {
    exec('sh /home/nitesh/scripts/xbmcshutdown');
  }
  if(/poweroff/.test(req.url)) {
    exec('sudo sh /home/nitesh/scripts/shutdown');
  }
  if(/xbmc\/commands/.test(req.url)) {
    //remote.connect();
    v1 = req.url.replace(/\/xbmc\/commands\//,'')
    if( v1 in ROKU_KEY_MAP) {
      remote.add(ROKU_KEY_MAP[v1]);
    }
  }
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end(index);
}).listen(12480);