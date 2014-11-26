#!/usr/bin/env node

var http = require('http');
var app = require('./app');
var phantomjs = require('node-qunit-phantomjs');

var server = http.createServer(app);
server.on('listening', function() {
  var port = server.address().port;
  var host = 'localhost:' + port;

  var process = phantomjs('http://'+host+'/test/test.html');
  process.on('exit', function(code) {
    server.on('close', function() {
      global.process.exit(code);
    });
    server.close();
  });
});
server.listen(0);
