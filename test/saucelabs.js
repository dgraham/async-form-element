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

function timeout(ms) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('timeout'));
    }, ms);
  });
}

function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
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
    'platforms': [['Windows 7', 'googlechrome', '38']],
    'url': url,
    'framework': 'qunit',
    'sauce-advisor': true
  }).then(function(obj) {
    function check() {
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
          return wait(2 * 1000).then(check);
        }
      });
    }
    return Promise.race([check(), timeout(180 * 1000)]);
  }).then(function(obj) {
    var tests = obj['js tests'];

    tests.forEach(function(test) {
      console.log(test.url);
      console.log(test.platform);
      console.log(test.result);
    });

    var passed = tests.every(function(test) {
      return typeof test.result === 'object' &&
        test.result.passed === test.result.total;
    });

    if (passed) {
      exitStatus = 0;
    }
  })['catch'](function(error) {
    setImmediate(function() {
      throw error;
    });
  }).then(function() {
    server.close();
  });
});
server.on('close', function() {
  global.process.exit(exitStatus);
});
server.listen(8080);
