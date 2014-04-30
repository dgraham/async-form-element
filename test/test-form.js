var formId = window.formId;

asyncTest('form GET request', 3, function() {
  var frame = QUnit.createFrame();

  frame.nextReady().then(function(window) {
    frame.nextReady().then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url.replace('?', ''), '/foo');
      equal(window.request.body, '');
      start();
    });

    var form = window.document.getElementById(formId);
    form.method = 'GET';
    form.action = '/foo';
    form.submit();
  });
  frame.src = '/form';
});

asyncTest('form POST request', 3, function() {
  var frame = QUnit.createFrame();

  frame.nextReady().then(function(window) {
    frame.nextReady().then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, '');
      start();
    });

    var form = window.document.getElementById('form');
    form.method = 'POST';
    form.action = '/foo';
    form.submit();
  });
  frame.src = '/form';
});

asyncTest('form GET request with field', 3, function() {
  var frame = QUnit.createFrame();

  frame.nextReady().then(function(window) {
    frame.nextReady().then(function(window) {
      equal(window.request.method, 'GET');
      equal(window.request.url, '/foo?bar=baz');
      equal(window.request.body, '');
      start();
    });

    var form = window.document.getElementById('form');
    form.method = 'GET';
    form.action = '/foo';

    var input = window.document.createElement('input');
    input.type = 'hidden';
    input.name = 'bar';
    input.value = 'baz';
    form.appendChild(input);

    form.submit();
  });
  frame.src = '/form';
});

asyncTest('form POST request with field', 3, function() {
  var frame = QUnit.createFrame();

  frame.nextReady().then(function(window) {
    frame.nextReady().then(function(window) {
      equal(window.request.method, 'POST');
      equal(window.request.url, '/foo');
      equal(window.request.body, 'bar=baz');
      start();
    });

    var form = window.document.getElementById('form');
    form.method = 'POST';
    form.action = '/foo';

    var input = window.document.createElement('input');
    input.type = 'hidden';
    input.name = 'bar';
    input.value = 'baz';
    form.appendChild(input);

    form.submit();
  });
  frame.src = '/form';
});
