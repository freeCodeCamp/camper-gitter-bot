"use strict";

// var _ = require('lodash-node');

var AppConfig = require('../../config/AppConfig');

// var toMarkdown = require('to-markdown');


var TextLib = {

    // we only show the first para
    // and limit to 20 lines
    trimLines: function(data, lines){
        //console.log("trimLines got", data.path);
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
    },

    dashedName: function(str) {
        if (!str) return;
        str = str.replace(/\s/g, "-");
        str = str.toLowerCase();
        str = str.replace('--', '-'); // in case of doubles
        str = str.replace(".md", "");
        // \?   leave Q marks
        str = str.replace(/([^a-z0-9áéíóúñü_@\-\s]|[\t\n\f\r\v\0])/gim, "");
        return str;
    }

}

module.exports = TextLib;
