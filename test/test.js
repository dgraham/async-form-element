["form", "async-form"].forEach(function(formId) {
  module(formId);

  promiseTest('form GET request', 4, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
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
    });
  });

  promiseTest('form POST request', 4, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
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
    })
  });

  promiseTest('form GET request with field', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
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
    });
  });

  promiseTest('form POST request with field', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
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
    });
  });

  promiseTest('form GET request with fields', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'GET';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'text';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      var select, option;
      select = window.document.createElement('select');
      select.name = 'select';
      form.appendChild(select);
      option = window.document.createElement('option');
      option.value = 'a';
      option.selected = true;
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'b';
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'c';
      select.appendChild(option);

      var textarea;
      textarea = window.document.createElement('textarea');
      textarea.name = 'text'
      textarea.value = 'foo';
      form.appendChild(textarea);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url, '/foo?foo=1&bar=2&select=a&text=foo');
      equal(window.request.body, '');
    });
  });

  promiseTest('form POST request with fields', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      form.method = 'POST';
      form.action = '/foo';

      var input = window.document.createElement('input');
      input.type = 'hidden';
      input.name = 'foo';
      input.value = '1';
      form.appendChild(input);

      input = window.document.createElement('input');
      input.type = 'text';
      input.name = 'bar';
      input.value = '2';
      form.appendChild(input);

      var select, option;
      select = window.document.createElement('select');
      select.name = 'select';
      form.appendChild(select);
      option = window.document.createElement('option');
      option.value = 'a';
      option.selected = true;
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'b';
      select.appendChild(option);
      option = window.document.createElement('option');
      option.value = 'c';
      select.appendChild(option);

      var textarea;
      textarea = window.document.createElement('textarea');
      textarea.name = 'text'
      textarea.value = 'foo';
      form.appendChild(textarea);

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, 'foo=1&bar=2&select=a&text=foo');
    });
  });
});

promiseTest('form POST request with async-accept', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    form.method = 'POST';
    form.action = '/foo';
    form.asyncAccept = 'application/json';

    form.submit();
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST');
    equal(window.request.url, '/foo');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(window.request.headers['accept'], 'application/json');
  })
});
