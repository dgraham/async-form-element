QUnit.createFrame = function() {
  var iframe = document.createElement('iframe');
  iframe.src = '/test/frame-form.html';

  var fixture = document.getElementById('qunit-fixture');
  fixture.appendChild(iframe);

  return function() {
    return new Promise(function(resolve, reject) {
      iframe.resolve = resolve;
      iframe.reject = reject;
    });
  };
};
