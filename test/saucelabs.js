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

function asyncForEach(ary, i, callback) {
  if (i < ary.length) {
    return Promise.resolve(callback(ary[i])).then(function() {
      return asyncForEach(ary, i+1, callback);
    });
  }
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

var server = http.createServer(app);
server.on('listening', function() {
  var port = server.address().port;
  var url  = 'http://localhost:'+port+'/test/test.html';

  asyncForEach([
    ['Windows 7', 'googlechrome', ''],
    ['Windows 7', 'firefox', '']
    // ['Windows 7', 'internet explorer', '11'],
    // ['Windows 7', 'internet explorer', '10'],
    // ['Windows 7', 'internet explorer', '9']
  ], 0, function(platform) {
    return fetchJSON({
      method: 'POST',
      hostname: 'saucelabs.com',
      path: '/rest/v1/' + process.env.SAUCE_USERNAME + '/js-tests',
      headers: {},
      auth: process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY
    }, {
      'build': process.env.TRAVIS_BUILD_NUMBER,
      'tags': [process.env.TRAVIS_PULL_REQUEST, process.env.TRAVIS_BRANCH],
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      'platforms': [platform],
      'url': url,
      'framework': 'qunit'
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
      var test = obj['js tests'][0];

      console.log(test.url);
      console.log(test.platform);
      console.log(test.result);

      var passed = test.result && (typeof test.result === 'object') &&
        test.result.passed === test.result.total;

      if (!passed) {
        throw 'tests failed';
      }
    });
  }).then(function() {
    server.close();
    global.process.exit(0);
  }, function(error) {
    setImmediate(function() {
      throw error;
    });
  });
});
server.listen(8080);
