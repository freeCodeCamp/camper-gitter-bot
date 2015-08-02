"use strict";

// var _ = require('lodash-node');

var AppConfig = require('../../config/AppConfig');

// var toMarkdown = require('to-markdown');


var TextLib = {

    // we only show the first para
    // and limit to 20 lines
    trimLines: function(data, lines){
        var part = data.split("\n## ")[0];
        lines = lines || AppConfig.MAX_WIKI_LINES;
        var subset = part.split('\n');
        subset = subset.slice(0, lines).join('\n');
        return subset;
    },

    toMarkdown: function(data) {
        return toMarkdown(data);
    },

    mdLink: function(text, uri) {
        return "[" + text + "](" + uri + ")";
    }

};

module.exports = TextLib;
