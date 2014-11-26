function asyncForm(method, url) {
  var form = document.createElement('form', 'async-form');
  form.action = url || '/request';
  form.method = method;
  document.getElementById('qunit-fixture').appendChild(form);
  return form;
}

asyncTest('form GET request', 5, function() {
  var form = asyncForm('get');
  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'GET');
    equal(json.url.replace('?', ''), '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], null);
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form POST request', 5, function() {
  var form = asyncForm('post');
  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url.replace('?', ''), '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], 'application/x-www-form-urlencoded');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('successful form post dispatches progress events', 4, function() {
  var form = asyncForm('post');

  form.addEventListener('loadstart', function(event) {
    event.stopPropagation();
    ok(true, 'Received loadstart event');
  });

  form.addEventListener('load', function(event) {
    event.stopPropagation();
    ok(true, 'Received load event');
  });

  form.addEventListener('loadend', function(event) {
    event.stopPropagation();
    ok(true, 'Received loadend event');
  });

  form.submit().then(function(response) {
    equal(response.status, 200);
    start();
  });
});

asyncTest('canceled form post dispatches progress events', 3, function() {
  var form = asyncForm('post');

  form.addEventListener('loadstart', function(event) {
    event.stopPropagation();
    event.preventDefault();
    ok(true, 'Received loadstart event');
  });

  form.addEventListener('abort', function(event) {
    event.stopPropagation();
    ok(true, 'Received abort event');
  });

  form.addEventListener('loadend', function(event) {
    event.stopPropagation();
    ok(true, 'Received loadend event');
    start();
  });

  form.submit().then(function(response) {
    ok(false, 'Form submit should have been canceled.');
  });
});

asyncTest('failing form post rejects promise', 3, function() {
  var form = asyncForm('post', '/boom');

  form.addEventListener('error', function(event) {
    event.stopPropagation();
    ok(true, 'Received error event');
  });

  form.addEventListener('loadend', function(event) {
    event.stopPropagation();
    ok(true, 'Received loadend event');
  });

  form.submit().then(function() {
    ok(false);
    start();
  }).catch(function(error) {
    equal(error.response.status, 500);
    start();
  });
});

asyncTest('network error on form post rejects promise', 4, function() {
  var form = asyncForm('post', '/error');

  form.addEventListener('error', function(event) {
    event.stopPropagation();
    ok(true, 'Received error event');
  });

  form.addEventListener('loadend', function(event) {
    event.stopPropagation();
    ok(true, 'Received loadend event');
  });

  form.submit().then(function() {
    ok(false);
    start();
  }).catch(function(error) {
    equal(error.message, 'Network Error');
    equal(error.response, null);
    start();
  });
});

asyncTest('form request with unknown method', 5, function() {
  var form = asyncForm('update');
  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'GET');
    equal(json.url.replace('?', ''), '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], null);
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form GET request with field', 4, function() {
  var form = asyncForm('get');

  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'bar';
  input.value = 'baz';
  form.appendChild(input);

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'GET');
    equal(json.url, '/request?bar=baz');
    equal(json.data, '');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form POST request with field', 4, function() {
  var form = asyncForm('post');

  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'bar';
  input.value = 'baz';
  form.appendChild(input);

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url, '/request');
    equal(json.data, 'bar=baz');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form GET request with fields', 4, function() {
  var form = asyncForm('get');

  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'foo';
  input.value = '1';
  form.appendChild(input);

  input = document.createElement('input');
  input.type = 'text';
  input.name = 'bar';
  input.value = '2';
  form.appendChild(input);

  var select, option;
  select = document.createElement('select');
  select.name = 'select';
  form.appendChild(select);

  option = document.createElement('option');
  option.value = 'a';
  option.selected = true;
  select.appendChild(option);

  option = document.createElement('option');
  option.value = 'b';
  select.appendChild(option);

  option = document.createElement('option');
  option.value = 'c';
  select.appendChild(option);

  var textarea = document.createElement('textarea');
  textarea.name = 'text';
  textarea.value = 'foo';
  form.appendChild(textarea);

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'GET');
    equal(json.url, '/request?foo=1&bar=2&select=a&text=foo');
    equal(json.data, '');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form POST request with fields', 4, function() {
  var form = asyncForm('post');

  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'foo';
  input.value = '1';
  form.appendChild(input);

  input = document.createElement('input');
  input.type = 'text';
  input.name = 'bar';
  input.value = '2';
  form.appendChild(input);

  var select, option;
  select = document.createElement('select');
  select.name = 'select';
  form.appendChild(select);

  option = document.createElement('option');
  option.value = 'a';
  option.selected = true;
  select.appendChild(option);

  option = document.createElement('option');
  option.value = 'b';
  select.appendChild(option);

  option = document.createElement('option');
  option.value = 'c';
  select.appendChild(option);

  var textarea = document.createElement('textarea');
  textarea.name = 'text';
  textarea.value = 'foo';
  form.appendChild(textarea);

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url, '/request');
    equal(json.data, 'foo=1&bar=2&select=a&text=foo');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form multipart POST request with field', 6, function() {
  var form = asyncForm('post');
  form.enctype = 'multipart/form-data';

  var input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'bar';
  input.value = 'baz';
  form.appendChild(input);

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url, '/request');

    var lines = json.data.split(/\r\n?/);
    equal(lines[1], 'Content-Disposition: form-data; name="bar"');
    equal(lines[3], 'baz');
    ok(json.headers['content-type'].match('multipart/form-data'), json.headers['content-type']);

    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form PUT request', 5, function() {
  var form = asyncForm('put');

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'PUT');
    equal(json.url, '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], 'application/x-www-form-urlencoded');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form DELETE request', 5, function() {
  var form = asyncForm('delete');

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'DELETE');
    equal(json.url, '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], 'application/x-www-form-urlencoded');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form POST request with default async-accept', 7, function() {
  var form = asyncForm('post');

  equal(form.asyncAccept, '*/*');

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url, '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(json.headers.accept, '*/*');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});

asyncTest('form POST request with custom async-accept', 7, function() {
  var form = asyncForm('post');
  form.asyncAccept = 'application/json';

  equal(form.asyncAccept, 'application/json');

  form.submit().then(function(response) {
    equal(response.status, 200);
    return response.json();
  }).then(function (json) {
    equal(json.method, 'POST');
    equal(json.url, '/request');
    equal(json.data, '');
    equal(json.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(json.headers.accept, 'application/json');
    start();
  }).catch(function(error) {
    ok(false, error);
    start();
  });
});
