#!/bin/bash
set -e

port=3000

# Find next available port
while lsof -i :$((++port)) >/dev/null; do true; done

# Spin a test server in the background
node ./test/server.js $port &>/dev/null &
server_pid=$!
trap "kill $server_pid" INT EXIT

node ./node_modules/.bin/node-qunit-phantomjs "http://localhost:$port/test/test.html"
