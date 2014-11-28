// PhantomJS is an old turd that doesn't normalize form methods correctly
//   https://github.com/ariya/phantomjs/issues/12056
var badFormMethodNormalization = (function() {
  var form = document.createElement('form');
  form.method = 'POST';
  return form.method !== 'post';
})();

// Yet another PhantomJS bug
//   https://github.com/ariya/phantomjs/issues/10873
var xhrDeleteBodyBuggy = navigator.userAgent.match(/PhantomJS/);

function submit(form) {
  var event = document.createEvent('Event');
  event.initEvent('submit', true, true);
  form.dispatchEvent(event);
  if (event.defaultPrevented === false) {
    form.submit();
  }
}

['form', 'async-form'].forEach(function(formId) {
  module(formId);

  promiseTest('form GET request', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      if (badFormMethodNormalization) {
        equal(form.method, 'GET', 'form.method should be "GET"');
      } else {
        equal(form.method, 'get', 'form.method should be "get"');
      }

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
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

      if (badFormMethodNormalization) {
        equal(form.method, 'POST', 'form.method should be "POST"');
      } else {
        equal(form.method, 'post', 'form.method should be "post"');
      }

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    });
  });

  promiseTest('form request with unknown method', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'UPDATE';
      form.action = '/foo';

      if (badFormMethodNormalization) {
        equal(form.method, 'UPDATE', 'form.method should be "UPDATE"');
      } else {
        equal(form.method, 'get', 'form.method should be "get"');
      }

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
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

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?bar=baz', 'request url should be "/foo?bar=baz"');
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

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
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
      textarea.name = 'text';
      textarea.value = 'foo';
      form.appendChild(textarea);

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url, '/foo?foo=1&bar=2&select=a&text=foo', 'request url should be "/foo?foo=1&bar=2&select=a&text=foo"');
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
      textarea.name = 'text';
      textarea.value = 'foo';
      form.appendChild(textarea);

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
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

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      var lines = window.request.body.split(/\r\n?/);
      equal(lines[1], 'Content-Disposition: form-data; name="bar"');
      equal(lines[3], 'baz');
      ok(window.request.headers['content-type'].match('multipart/form-data'), window.request.headers['content-type']);
    });
  });

  promiseTest('form multipart POST request with empty file', 5, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'POST';
      form.action = '/foo';
      form.enctype = 'multipart/form-data';

      var input = window.document.createElement('input');
      input.type = 'file';
      input.name = 'bar';
      form.appendChild(input);

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'POST', 'request method should be "POST"');
      equal(window.request.url, '/foo', 'request url should be "/foo"');
      var lines = window.request.body.split(/\r\n?/);
      equal(lines[1], 'Content-Disposition: form-data; name="bar"; filename=""');
      equal(lines[3], '');
      ok(window.request.headers['content-type'].match('multipart/form-data'), window.request.headers['content-type']);
    });
  });

  promiseTest('form with submit event propagation stopped', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      form.addEventListener('submit', function(event) {
        event.stopPropagation();
      });

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
    });
  });

  promiseTest('form GET request with stopped propagation', 4, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      form.addEventListener('submit', function(event) {
        event.stopPropagation();
      });

      submit(form);
      return ready();
    }).then(function(window) {
      equal(window.request.method, 'GET', 'request method should be "GET"');
      equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
      equal(window.request.body, '');
      equal(window.request.headers['content-type'], null);
    });
  });

  promiseTest('form submit prevent default', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var nextSubmitEvent = new Promise(function(resolve) {
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          resolve(event);
        });
      });

      submit(form);
      return nextSubmitEvent;
    }).then(function(event) {
      equal(event.defaultPrevented, true);
      return ready(100);
    }).then(function() {
      ok(false, 'form was submitted');
    }, function() {
      ok(true, 'form was not submitted');
    });
  });

  promiseTest('form submit prevent default and stopped propagation', 2, function() {
    var ready = QUnit.createFrame();

    return ready().then(function(window) {
      var form = window.document.getElementById(formId);
      window.CustomElements.upgrade(form);

      form.method = 'GET';
      form.action = '/foo';

      var nextSubmitEvent = new Promise(function(resolve) {
        form.addEventListener('submit', function(event) {
          event.stopPropagation();
          event.preventDefault();
          resolve(event);
        });
      });

      submit(form);
      return nextSubmitEvent;
    }).then(function(event) {
      equal(event.defaultPrevented, true);
      return ready(100);
    }).then(function() {
      ok(false, 'form was submitted');
    }, function() {
      ok(true, 'form was not submitted');
    });
  });
});


module('async-form');

promiseTest('form PUT request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'PUT';
    form.action = '/foo/1';

    equal(form.asyncMethod, 'put');

    submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'PUT', 'request method should be "PUT"');
    equal(window.request.url, '/foo/1', 'request url should be "/foo/1"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
  });
});

promiseTest('form DELETE request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'DELETE';
    form.action = '/foo/1';

    equal(form.asyncMethod, 'delete');

    submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'DELETE', 'request method should be "DELETE"');
    equal(window.request.url, '/foo/1', 'request url should be "/foo/1"');
    equal(window.request.body, '');
    if (xhrDeleteBodyBuggy) {
      ok(true);
    } else {
      equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    }
  });
});

promiseTest('form POST request with default async-accept', 6, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';

    equal(form.asyncAccept, '*/*');

    submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(window.request.headers.accept, '*/*');
  });
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

    submit(form);
    return ready();
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
    equal(window.request.headers.accept, 'application/json');
  });
});

promiseTest('form asyncSubmit GET request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    equal(form.asyncMethod, 'get');

    return window.handleFormResponse(form.asyncSubmit());
  }).then(function(window) {
    equal(window.request.method, 'GET', 'request method should be "GET"');
    equal(window.request.url.replace('?', ''), '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], null);
  });
});

promiseTest('form asyncSubmit POST request', 5, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'POST';
    form.action = '/foo';

    equal(form.asyncMethod, 'post');

    return window.handleFormResponse(form.asyncSubmit());
  }).then(function(window) {
    equal(window.request.method, 'POST', 'request method should be "POST"');
    equal(window.request.url, '/foo', 'request url should be "/foo"');
    equal(window.request.body, '');
    equal(window.request.headers['content-type'], 'application/x-www-form-urlencoded');
  });
});

promiseTest('form submission with prevent default', 2, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    var nextSubmit = new Promise(function(resolve) {
      form.addEventListener('submit', function(event) {
        event.submission.then(function() {
          ok(false);
          resolve();
        }, function(error) {
          ok(error);
          equal(error.message, 'submit default action canceled');
          resolve();
        });
        event.preventDefault();
      });
    });

    submit(form);
    return nextSubmit;
  });
});

promiseTest('form submission with prevent default and propagation stopped', 2, function() {
  var ready = QUnit.createFrame();

  return ready().then(function(window) {
    var form = window.document.getElementById('async-form');
    window.CustomElements.upgrade(form);

    form.method = 'GET';
    form.action = '/foo';

    var nextSubmit = new Promise(function(resolve) {
      form.addEventListener('submit', function(event) {
        event.submission.then(function() {
          ok(false);
          resolve();
        }, function(error) {
          ok(error);
          equal(error.message, 'submit default action canceled');
          resolve();
        });
        event.preventDefault();
        event.stopPropagation();
      });
    });

    submit(form);
    return nextSubmit;
  });
});
