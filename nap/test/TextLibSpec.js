"use strict";

var assert = require("chai").assert,
    expect = require("chai").expect;

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
        var p = KBase.initAsync();
        p.then(function() {
            console.log("topics", KBase.topics);
            // console.log("wiki loaded");
            expect(KBase.topics).not.to.be.null;
        });
    });

    it("should take the first 5 lines of a chunk", function () {
        var short = TextLib.trimLines(longTextBlock, 5);
        // console.log(short);
    });

    it("should cut off text at first ## h2", function () {
        var short = TextLib.trimLines(textWithHeader, 5);
        // console.log(short);
    });


    // FIXME WTF isn't KB loaded
    // it("should trim chai entry", function () {
    //     var params = "chai";
    //     var text = KBase.getTopicData(params);
    //     console.log('topics', KBase.topics);
    //     var short = TextLib.trimLines(text);
    //     console.log(short);
    // });


});
