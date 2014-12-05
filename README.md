# &lt;form is="async-form"&gt;

Progressively enhances a form element to submit via XHR.

## Installation

Install the component using [Bower](http://bower.io/):

```sh
$ bower install async-form-element --save
```

```html
<!-- Include a Web Components polyfill -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.3/platform.js"></script>
<!-- Include a ES6 Promise polyfill -->
<script src="http://s3.amazonaws.com/es6-promises/promise-1.0.0.min.js"></script>

<script src="async-form-element.js"></script>
```

## Usage

Any async form behaves just like a regular form element, except when submitted, it does an XHR request instead.

```html
<form is="async-form" method="post" action="/josh/async-form-element/fork">
  <input type="submit" value="Fork">
</form>
```

``` javascript
form.addEventListener('submit', function(event) {
  // event.submission is a promise tracking the form submission progress.
  event.submission.then(function(response) {
    console.log('form submitted successfully');
  });
});

// Explicit asyncSubmit() invocations return the submission promise
form.asyncSubmit().then(function(response) {
  console.log('form submitted successfully');
});
```

## See Also

* Rails' [`<form data-remote>`](http://edgeguides.rubyonrails.org/working_with_javascript_in_rails.html#form-for)
* [josh/rails-behaviors](https://github.com/josh/rails-behaviors)

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 9+* ✔ | Latest ✔ | 6.1+ ✔ |

*Multipart Forms with Uploads require IE10+*
