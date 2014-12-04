#!/usr/bin/env node

var http = require('http');
var app = require('./app');
var phantomjs = require('node-qunit-phantomjs');

var exitStatus = 1;

var server = http.createServer(app);
server.on('listening', function() {
  var port = server.address().port;
  var host = 'localhost:' + port;

  var process = phantomjs('http://'+host+'/test/test.html');
  process.on('exit', function(code) {
    exitStatus = code;
    server.close();
  });
});
server.on('close', function() {
  global.process.exit(exitStatus);
});
server.listen(0);
