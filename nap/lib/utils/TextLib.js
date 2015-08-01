"use strict";

// var _ = require('lodash-node');

var AppConfig = require('../../config/AppConfig');


var TextLib = {

    // we only show the first para
    // and limit to 20 lines
    trimLines: function(data, lines){
        var part = data.split("\n## ")[0];
        lines = lines || AppConfig.MAX_WIKI_LINES;
        var subset = part.split('\n');
        subset = subset.slice(0, lines).join('\n');
        return subset;
    }

};

module.exports = TextLib;
