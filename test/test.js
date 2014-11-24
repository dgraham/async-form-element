['form', 'async-form'].forEach(function(formId) {
  module(formId);

  promiseTest('form GET request', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      equal(form.method, 'get');

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url.replace('?', ''), '/foo');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    });
  });

  promiseTest('form POST request', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';

      equal(form.method, 'post');

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    })
  });

  promiseTest('form request with unknown method', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'UPDATE';
      form.action = '/foo';

      equal(form.method, 'get');

      form.submit();
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url.replace('?', ''), '/foo');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    });
  });

  promiseTest('form GET request with field', 3, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

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
      window.CustomElements.upgrade(form);

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
      window.CustomElements.upgrade(form);

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
      window.CustomElements.upgrade(form);

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

  promiseTest('form multipart POST request with field', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';
      form.enctype = 'multipart/form-data';

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
      var lines = window.request.body.split(/\r\n?/);
      equal(lines[1], 'Content-Disposition: form-data; name="bar"');
      equal(lines[3], 'baz');
      ok(window.request.headers['content-type'].match('multipart/form-data'), window.request.headers['content-type']);
    });
  });
});

promiseTest('form PUT request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'PUT';
    form.action = '/foo/1';

    equal(form.asyncMethod, 'put');

    form.submit();
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'PUT');
    equal(window.request.url, '/foo/1');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
  })
});

promiseTest('form DELETE request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'DELETE';
    form.action = '/foo/1';

    equal(form.asyncMethod, 'delete');

    form.submit();
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'DELETE');
    equal(window.request.url, '/foo/1');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
  })
});

promiseTest('form POST request with default async-accept', 6, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';

    equal(form.asyncAccept, '*/*');

    form.submit();
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST');
    equal(window.request.url, '/foo');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(window.request.headers['accept'], '*/*');
  })
});

promiseTest('form POST request with async-accept', 6, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';
    form.asyncAccept = 'application/json';

    equal(form.asyncAccept, 'application/json');

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
