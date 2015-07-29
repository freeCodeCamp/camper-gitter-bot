'use strict';

var binary = require('node-pre-gyp');
var path = require('path')
var binding_path = binary.find(path.resolve(path.join(__dirname,'./package.json')));
var binding = require(binding_path);

module.exports = sleep;
function sleep(milliseconds) {
  var start = Date.now();
  if (milliseconds !== (milliseconds | 0)) {
    throw new TypeError('sleep only accepts an integer number of milliseconds');
  }
  milliseconds = milliseconds | 0;
  if (milliseconds < 0) {
    throw new TypeError('sleep only accepts a positive number of milliseconds');
  }
  var result = binding.sleep(milliseconds);
  var end = Date.now();
  return end - start;
}
