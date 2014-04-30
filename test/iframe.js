QUnit.createFrame = function() {
  var iframe = document.createElement('iframe');
  iframe.src = '/form';

  var fixture = document.getElementById('qunit-fixture');
  fixture.appendChild(iframe);

  return function() {
    return new Promise(function(resolve, reject) {
      iframe.resolve = resolve;
      iframe.reject = reject;
    });
  };
};
