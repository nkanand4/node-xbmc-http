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
  var code, upcode;
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
  if(/xbmc\/direct/.test(req.url)) {
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
  }

  if(/toggledoor/.test(req.url)) {
    console.log('Toggling door');
    //exec('echo $(date) >> /home/pi/logs/relay.log')
    exec('sudo python /home/pi/developer/scripts/toggledoor >> /home/pi/logs/relay.log');
  }
  if(/togglelight/.test(req.url)) {
    var lightparams = req.url.replace('/api/togglelight/', '');
    console.log('controlling light', lightparams);
    exec('sudo python /home/pi/developer/scripts/togglelight '+lightparams+'>> /home/pi/logs/relay.log');
  }

  if(/^\/html/.test(req.url)) {
    fs.readFile(process.env.XBMC_REMOTE+'/html/'+req.url.replace(/\/html\//, ''), {encoding: 'utf-8'}, function(err, data) {
      var content = '';
      if(err) {
        content = 'File not found or could not be read!';
      }else {
        content = data;
        res.setHeader('Cache-Control', 'private, max-age=604800')
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
  }else {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end('var message = "json request acknowledge."');
  }

}).listen(12480);

//setting up relay(s) for web access
exec('sudo python /home/pi/developer/scripts/relay-setup')
