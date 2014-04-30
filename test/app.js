var fs = require('fs');
var connect = require('connect');

module.exports = connect()
  .use(connect['static'](__dirname + '/..'))
  .use(function(req, res) {
    var info = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: ''
    };
    req.on('data', function(chunk) {
      info.body += chunk;
    });
    req.on('end', function() {
      fs.readFile(__dirname + '/iframe.html', function(err, data) {
        data = data.toString().replace('<%= JSON %>', JSON.stringify(info));
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
    });
  });
