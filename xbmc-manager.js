var http = require('http');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var restartTracker = 0;
var index = fs.readFileSync(process.env.XBMC_REMOTE+'/found.js');
var remote = require('./xbmc-remote');
var ROKU_KEY_MAP = {0:"Input.Back", 2:"Input.Up", 3:"Input.Down",
                        4:"Input.Left", 5:"Input.Right", 6:"Input.Select", 7:"Input.ShowOSD",
                        8:"Player.Rewind", 9:"Player.Forward", 10:"Input.Info", 13:"Player.PlayPause"};
var timer, repeater;

http.createServer(function (req, res) {
  var code, upcode;
    console.log('Doing something');
  if(/shutdown/.test(req.url)) {
    exec('sh /home/pi/developer/scripts/xbmcshutdown');
  }
  if(/poweroff/.test(req.url)) {
    exec('sudo sh /home/pi/developer/scripts/shutdown');
  }
  if(/restart/.test(req.url)) {
    console.log('Doing restart');
    exec('sh /home/pi/developer/scripts/restartxbmc');
  }
  if(/xbmc\/jump/.test(req.url)) {
    var params = decodeURIComponent(path.basename(req.url));
    try{
      params = JSON.parse(params);
    }catch(e) {
      // not an object, just a string
    }
    remote.add('Player.Seek', params);
  }
  if(/xbmc\/commands/.test(req.url)) {
    //remote.connect();
    code = req.url.replace(/\/xbmc\/commands\//,'')
    //upcode = code < 100 ? code + 100 : code;
    // be on safe side, clear timers anyways
    //clearTimeout(timer);
    //clearInterval(repeater);
    // wake up if sleeping
    remote.add('Player.GetActivePlayers');
    if( code in ROKU_KEY_MAP) {
      remote.add(ROKU_KEY_MAP[code]);
    }
    if(ROKU_KEY_MAP[code] === "Input.Info" || code == 110) {
        restartTracker += 1;
    }else {
        restartTracker = 0;
    }
    if(restartTracker === 10) {
        console.log('Doing restart');
        restartTracker = 0;
        exec('sh /home/pi/developer/scripts/restartxbmc');
    }
    /* removing setInterval as it is scary, will re-visit with setTimeout
    if(code < 7) {
      timer = setTimeout(function() {
      // send last command repeatedly.
        repeater = setInterval(function() {
          remote.add(ROKU_KEY_MAP[code]);
        }, 300);
      }, 1000);
    }*/
  }
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end(index);
}).listen(12480);