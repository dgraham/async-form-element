#!/usr/bin/env node

var port = Number(process.argv[2] || 3000);

var fs = require('fs');
var http = require('http');
var url = require('url');

var routes = {
  '/request': function(res, req) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    var data = '';
    req.on('data', function(c) { data += c; });
    req.on('end', function() {
      res.end(JSON.stringify({
        method: req.method,
        url: req.url,
        headers: req.headers,
        data: data
      }));
    });
  },
  '/boom': function(res) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('boom');
  },
  '/empty': function(res) {
    res.writeHead(204);
    res.end();
  },
  '/error': function(res) {
    res.destroy();
  }
};

var types = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  txt: 'text/plain'
};

http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var route = routes[pathname];
  if (route) {
    route(res, req);
  } else {
    fs.readFile(__dirname + '/..' + pathname, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': types.txt});
        res.end('Not Found');
      } else {
        var ext = (pathname.match(/\.([^\/]+)$/) || [])[1];
        res.writeHead(200, {'Content-Type': types[ext] || types.txt});
        res.end(data);
      }
    });
  }
}).listen(port);
