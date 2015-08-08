"use strict";
require('dotenv').config({path: 'dot.env'});

var expect = require("chai").expect;

var TextLib = require("../lib/utils/TextLib");
var KBase = require("../lib/bot/Kbase");

var longTextBlock = `# Headline
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
`;


var textWithHeader = `# Headline
line 1
line 2
line 3
## header2
line 4
line 5
line 6
line 7
line 8
line 9
line 10
`;



describe("TextLib", function () {

    it("should load the Wiki", function() {
        KBase.initSync();
    });

    it("should take the first 5 lines of a chunk", function () {
        var short = TextLib.trimLines(longTextBlock, 5);
        // console.log(short);
    });

    it("should cut off text at first ## h2", function () {
        var short = TextLib.trimLines(textWithHeader, 5);
        //console.log(short);
    });


     it("should trim camperbot entry", function () {
         var params = "camperbot";
         var topicData = KBase.getTopicData(params);
         //console.log('camperbot', text.fileName);
         var short = TextLib.trimLines(topicData.data);
         //console.log(topicData);
         //console.log(blob.short);
     });


});
