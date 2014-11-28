require('es6-promise').polyfill();
var http = require('http');
var https = require('https');
var app = require('./app');

function fetchJSON(options, obj) {
  var data = JSON.stringify(obj);
  options.headers['Content-Type'] = 'application/json';
  options.headers['Content-Length'] = data.length;

  return new Promise(function(resolve, reject) {
    var req = https.request(options, function(res) {
      var json = '';
      res.on('data', function(d) { json += d; });
      res.on('end', function() {
        resolve(JSON.parse(json));
      });
    });
    req.end(data);
    req.on('error', reject);
  });
}

var exitStatus = 1;

var server = http.createServer(app);
server.on('listening', function() {
  var port = server.address().port;
  var url  = 'http://localhost:'+port+'/test/test.html';

  fetchJSON({
    method: 'POST',
    hostname: 'saucelabs.com',
    path: '/rest/v1/' + process.env.SAUCE_USERNAME + '/js-tests',
    headers: {},
    auth: process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY
  }, {
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'tags': [process.env.TRAVIS_PULL_REQUEST, process.env.TRAVIS_BRANCH],
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'platforms': [['Windows 7', 'firefox', '27']],
    'url': url,
    'framework': 'qunit'
  }).then(function(obj) {
    function check(n) {
      if (!n) {
        throw 'status timed out';
      }

      return fetchJSON({
        method: 'POST',
        hostname: 'saucelabs.com',
        path: '/rest/v1/' + process.env.SAUCE_USERNAME + '/js-tests/status',
        headers: {},
        auth: process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY
      }, obj).then(function(obj) {
        if (obj.completed === true) {
          return obj;
        } else {
          return check(n-1);
        }
      });
    }
    return check(1000);
  }).then(function(obj) {
    var test = obj['js tests'][0];
    console.log(test.url);
    if (test.result.passed) {
      exitStatus = 0;
    }
  })['catch'](function(error) {
    console.error(error);
  }).then(function() {
    server.close();
  });
});
server.on('close', function() {
  global.process.exit(exitStatus);
});
server.listen(8080);
