(function() {
  'use strict';

  var AsyncFormElementPrototype = Object.create(HTMLFormElement.prototype);

  Object.defineProperty(AsyncFormElementPrototype, 'asyncAccept', {
    get: function() {
      return this.getAttribute('async-accept') || '*/*';
    },
    set: function(value) {
      this.setAttribute('async-accept', value);
    }
  });

  Object.defineProperty(AsyncFormElementPrototype, 'asyncMethod', {
    get: function() {
      var method = this.getAttribute('method');
      if (method) {
        method = method.toLowerCase();
      }
      switch (method) {
        case 'get':
        case 'post':
        case 'put':
        case 'delete':
          return method;
      }
      return 'get';
    },
    set: function(value) {
      this.setAttribute('method', value);
    }
  });

  var onasyncsubmitProps = new WeakMap();

  Object.defineProperty(AsyncFormElementPrototype, 'onasyncsubmit', {
    get: function() {
      return onasyncsubmitProps.get(this);
    },
    set: function(value) {
      var oldValue = onasyncsubmitProps.get(this);
      this.removeEventListener('asyncsubmit', oldValue, false);
      this.addEventListener('asyncsubmit', value, false);
      return value;
    }
  });

  function makeDeferred() {
    var resolve, reject;
    var promise = new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    return Object.defineProperties(promise, {
      resolve: { value: resolve },
      reject: { value: reject }
    });
  }

  function nextTick(fn) {
    Promise.resolve().then(fn);
  }

  var submitEventDefaultPrevented = new WeakMap();
  var submitEventDispatched = new WeakMap();

  function resolveSubmitDispatch(event) {
    if (AsyncFormElementPrototype.isPrototypeOf(event.target)) {
      var dispatched = submitEventDispatched.get(event);
      if (submitEventDefaultPrevented.get(event)) {
        dispatched.reject(new Error('submit default action canceled'));
      } else {
        dispatched.resolve();
      }
    }
  }

  function captureAsyncFormSubmit(event) {
    if (AsyncFormElementPrototype.isPrototypeOf(event.target)) {
      var target = event.target;

      // Always disable default form submit
      event.preventDefault();

      event.preventDefault = function() {
        submitEventDefaultPrevented.set(event, true);
      };

      var dispatched = makeDeferred();
      submitEventDispatched.set(event, dispatched);

      nextTick(function() {
        resolveSubmitDispatch(event);
      });

      window.removeEventListener('submit', resolveSubmitDispatch, false);
      window.addEventListener('submit', resolveSubmitDispatch, false);

      dispatched.then(function() {
        var asyncevent = document.createEvent('Event');
        asyncevent.initEvent('asyncsubmit', true, true);
        var submission = asyncevent.submission = makeDeferred();
        target.dispatchEvent(asyncevent);

        if (asyncevent.defaultPrevented) {
          submission.reject(new Error('asyncsubmit default action canceled'));
        } else {
          target.request().then(submission.resolve, submission.reject);
        }
      });
    }
  }

  window.addEventListener('submit', captureAsyncFormSubmit, true);

  AsyncFormElementPrototype.createdCallback = function() {
    var value = this.getAttribute('onasyncsubmit');
    if (value) {
      this.attributeChanged('onasyncsubmit', null, value);
    }
  };

  AsyncFormElementPrototype.attributeChanged = function(attrName, oldValue, newValue) {
    if (attrName === 'onasyncsubmit') {
      this.onasyncsubmit = new Function('event', newValue);
    }
  };

  AsyncFormElementPrototype.asyncSubmit = function() {
    return this.request();
  };

  AsyncFormElementPrototype.serializeFormData = function() {
    return new FormData(this);
  };

  AsyncFormElementPrototype.serializeUrlEncoded = function() {
    var params = [];
    var i, els = this.elements;
    for (i = 0; i < els.length; i++) {
      params.push([els[i].name, els[i].value]);
    }

    var urlencoded = [];
    for (i = 0; i < params.length; i++) {
      urlencoded.push(encodeURIComponent(params[i][0]) +
        '=' +
        encodeURIComponent(params[i][1]));
    }
    return urlencoded.join('&');
  };

  AsyncFormElementPrototype.request = function() {
    var form = this;
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      var method = form.asyncMethod;
      var url = form.action;
      if (method === 'get') {
        url += '?' + form.serializeUrlEncoded();
      }
      var body;

      req.open(method.toUpperCase(), url);
      req.setRequestHeader('Accept', form.asyncAccept);

      if (method !== 'get') {
        req.setRequestHeader('Content-Type', form.enctype);

        if (form.enctype === 'multipart/form-data') {
          body = form.serializeFormData();
        } else {
          body = form.serializeUrlEncoded();
        }
      }

      req.onload = function() {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(new Error('Network Error'));
      };

      req.send(body);
    });
  };

  window.AsyncFormElement = document.registerElement('async-form', {
    prototype: AsyncFormElementPrototype,
    'extends': 'form'
  });
})();
