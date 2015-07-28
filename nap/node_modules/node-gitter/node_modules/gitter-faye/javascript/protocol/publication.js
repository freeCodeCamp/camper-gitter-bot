'use strict';

var Faye = require('../faye');
var Faye_Class = require('../util/class');
var Faye_Deferrable = require('../mixins/deferrable');

var Faye_Publication = Faye_Class(Faye_Deferrable);

module.exports = Faye_Publication;
