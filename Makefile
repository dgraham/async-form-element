build: node_modules/ bower_components/

lint: node_modules/
	./node_modules/.bin/jshint *.js test/*.js

test: build lint
	node ./test/run.js

saucelabs: build lint
	node ./test/saucelabs.js

travis: test saucelabs

bower_components/: node_modules/
	./node_modules/.bin/bower install

node_modules/:
	npm install

clean:
	rm -rf ./bower_components ./node_modules

.PHONY: build test travis lint clean
