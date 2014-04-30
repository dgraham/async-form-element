["form", "async-form"].forEach(function(formId) {
  module(formId);

  asyncTest('form GET request', 4, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'GET';
      form.action = '/foo';

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url.replace('?', ''), '/foo');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    }).then(start);
  });

  asyncTest('form POST request', 4, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'POST';
      form.action = '/foo';

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    }).then(start);
  });

  asyncTest('form GET request with field', 3, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = 'baz';
      form.appendChild(input);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url, '/foo?bar=baz');
      equal(window.request.body, '');
    }).then(start);
  });

  asyncTest('form POST request with field', 3, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'POST';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = 'baz';
      form.appendChild(input);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, 'bar=baz');
    }).then(start);
  });

  asyncTest('form GET request with fields', 3, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url, '/foo?foo=1&bar=2');
      equal(window.request.body, '');
    }).then(start);
  });

  asyncTest('form POST request with fields', 3, function() {
    var ready = QUnit.createFrame();

    ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'POST';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, 'foo=1&bar=2');
    }).then(start);
  });
});
