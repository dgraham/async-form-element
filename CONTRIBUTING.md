# Contributing

## Development

Clone the repository from GitHub.

```
$ git clone https://github.com/josh/async-form-element
```

Now just cd into the directory and run `make` to install the development dependencies.

```
$ cd async-form-element/
$ make
```

## Testing

Lint tools and headless tests can be ran via `make`.

```
$ make test
```

The QUnit test suite can also be ran in the browser. A local Node.js server must be running.

```
$ node ./test/server.js
$ open http://localhost:3000/test/test.html
```
