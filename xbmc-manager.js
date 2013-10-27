var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var index = fs.readFileSync('/home/nitesh/Developer/workspace/xbmc-manager/found.js');
var remote = require('./xbmc-remote');
var ROKU_KEY_MAP = {0:"Input.Back", 2:"Input.Up", 3:"Input.Down",
                        4:"Input.Left", 5:"Input.Right", 6:"Input.Select", 7:"Input.ShowOSD",
                        8:"Player.Rewind", 9:"Player.Forward", 10:"Input.Info", 13:"Player.PlayPause"};
var timer, repeater;

http.createServer(function (req, res) {
  var code, upcode;
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
    code = req.url.replace(/\/xbmc\/commands\//,'')
    //upcode = code < 100 ? code + 100 : code;
    // be on safe side, clear timers anyways
    clearTimeout(timer);
    clearInterval(repeater);
    // wake up if sleeping
    remote.add('Player.GetActivePlayers');
    if( code in ROKU_KEY_MAP) {
      remote.add(ROKU_KEY_MAP[code]);
    }
    if(code < 6) {
      timer = setTimeout(function() {
      // send last command repeatedly.
        repeater = setInterval(function() {
          remote.add(ROKU_KEY_MAP[code]);
        }, 300);
      }, 1000);
    }
  }
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end(index);
}).listen(12480);