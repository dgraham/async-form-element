# &lt;form is="async-form"&gt;


## Installation

Install the component using [Bower](http://bower.io/):

```sh
$ bower install async-form-element --save
```

```html
<!-- Include a Web Components polyfill -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/polymer/0.2.3/platform.js"></script>
<script src="async-form-element.js"></script>
```

## Usage

Any async form behaves just like a regular form element, except when submitted, it does an XHR request instead.

```html
<form is="async-form" method="post" action="/josh/async-form-element/fork">
  <input type="submit" value="Fork">
</form>
```

## See Also

* Rails' [`<form data-remote>`](http://edgeguides.rubyonrails.org/working_with_javascript_in_rails.html#form-for)
* [josh/rails-behaviors](https://github.com/josh/rails-behaviors)
