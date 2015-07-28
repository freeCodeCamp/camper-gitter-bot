'use strict';

var csprng = require('csprng');

var ID_LENGTH = 160;


module.exports = function random(bitlength) {
  bitlength = bitlength || ID_LENGTH;
  var maxLength = Math.ceil(bitlength * Math.log(2) / Math.log(36));
  var string = csprng(bitlength, 36);
  while (string.length < maxLength) string = '0' + string;
  return string;
};
