test: node_modules/ bower_components/ lint
	node ./node_modules/.bin/node-qunit-phantomjs http://localhost:3000/test/test-form.html
	node ./node_modules/.bin/node-qunit-phantomjs http://localhost:3000/test/test-async-form.html

lint: node_modules/
	./node_modules/.bin/jshint *.js test/*.js

bower_components/: node_modules/
	./node_modules/.bin/bower install

node_modules/:
	npm install

clean:
	rm -rf ./bower_components ./node_modules

.PHONY: lint test clean
