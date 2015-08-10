"use strict";

var TextLib = require('../utils/TextLib');

var fs = require("fs"),
    path = require("path"),
    Utils = require('../utils/Utils');

//var glob = require("glob");

// topicNameList - list of individual topic keywords eg "chai-cheat"
// topics    - Hash full data of all topics

//  example topic:
//
// 'js-for':
//  { path: '/Users/dc/dev/fcc/gitterbot/nap/data/wiki/js-for.md',
//    topic: 'js-for',
//    fname: 'js-for.md',
//    data: 'The javascript `for` command iterates through a list of items.\n\n```js\nfor (var i = 0; i < 9; i++) {\n   console.log(i);\n   // more statements\n}\n```\n\n----',
//    shortData: 'The javascript `for` command iterates through a list of items.\n\n```js\nfor (var i = 0; i < 9; i++) {\n   console.log(i);\n   // more statements\n}\n```\n\n----' },


var KBase;

KBase = {
    files: [],
    topics: null,

    staticReplies: {
        ebn: "this is the ebn test response",
        // menu: "I know lots about **javascript**! Pick one of:\n - `functions` \n - `objects`",
        // help: "Type `menu` for some starting points or check the [guide](http://www.freecodecamp.com/field-guide/all-articles)",
        link: "try this [guide](http://www.freecodecamp.com/field-guide/all-articles).",
        objects: "good question! well, shall we talk about **classical** or **prototypical** ?",
        hint: "depending on the topic, I'm going to show you a context sensitive `hint` here.",
        image: "![This is a cat](http://40.media.tumblr.com/tumblr_m2nmt6CouC1rtpv45o1_500.jpg)",
        imageurl: "http://40.media.tumblr.com/tumblr_m2nmt6CouC1rtpv45o1_500.jpg",
        quote: "> this is a quote",
        functions: "this is a function: \n ```javascript \nfunction foo() {\n" + "  alert('hi');\n" + "}; ```",
        heading: "# This is a heading",
        code: "this is inline code `foo();` yay.",
        tasks: "- [x] learn to code\n- [ ] ?????\n- [ ] profit?",
        graph: "http://myserver.com/graphs?period=today.gif",
        star: "> some stuff here quoted \n\n[vote](http://www.freecodecamp.com/field-guide/all-articles)\n" + "> another one here \n[vote](http://www.freecodecamp.com/field-guide/all-articles)"
    },


    initSync: function (forceReload) {
        //forceReload = forceReload || false;
        var wikiDataDir = path.join(__dirname, "/../../data/wiki");  // FIXME - works relative?

        KBase.allData = [];
        fs.readdirSync(wikiDataDir).forEach(function (name) {
            //console.log("reading", name);
            if (! /md$/.test(name) ) {
                //console.log("skipping " + name);
            } else {
                var filePath = path.join(wikiDataDir, name);
                var arr = filePath.split(path.sep);
                var fileName = arr[arr.length - 1];
                fileName = fileName.toLowerCase();
                var topicName = fileName.replace(".md", "");
                var data = fs.readFileSync(filePath, "utf8");
                var blob = {
                    path: filePath,
                    displayName: Utils.namify(topicName),
                    fileName: fileName,
                    data: data,
                    shortData: TextLib.trimLines(data),
                    dashedName: TextLib.dashedName(topicName)
                };
                KBase.allData.push(blob);
            }
        });
        // Utils.clog("loaded KBase items:", KBase.allData.length);
        return KBase.allData;
    },

    getWikiHints: function (bfName) {
        var topicData = this.getTopicData(bfName);
        if (topicData) {
            var wikiHints = topicData.data.split("##");
            // Utils.tlog('loaded hints for', bfName);

            return wikiHints;
        } else {
            return null;
        }
    },

    getTopicData: function (params, recursing) {
        var res, kb = this;
        var searchDashName = TextLib.dashedName(params);

        res = KBase.staticReplies[searchDashName];
        if (res) {
            return (res);
        }
        if (!KBase.allData) {
            KBase.initSync();
        } else {

            //Utils.tlog('kb.topics', kb.topics);
            var shortList = kb.allData.filter(function (t) {
                return (t.dashedName.includes(searchDashName));
            });
            if (shortList) {
                return shortList[0];
            } else {
                Utils.warn("KBase", 'cant find topicData for', params);
                Utils.warn("Kbase", "allData", KBase.allData);
                return null;
            }
        }

    },

    getTopics: function (keyword) {
        // TODO - refac and use function above
        var searchDashName = TextLib.dashedName(keyword);
        var shortList = this.allData.filter(function (t) {
            return (t.dashedName.includes(searchDashName));
        });
        return shortList;
    },

    //    return topics as markdown links
    getTopicsAsList: function(keyword) {
        var shortList = this.getTopics(keyword);
        if (shortList.length === 0) {
            return "nothing found";
        }
        // else
        Utils.log("shortList", shortList);

        var emojiList = [':zero:', ':one:', ':two:', ':three:', ':four:', 
                            ':five:', ':six:', ':seven:', ':eight:', ':nine:'];

        var findResults = "";
        for (var i = 0; i < shortList.length; i++) {
            var topicData = shortList[i];
            var link = Utils.linkify(topicData.dashedName, 'wiki', topicData.displayName);
            if (i < 10) {
                var line = "\n " + emojiList[i] + " " + link;
            } else if (i < 100) {
                var iSplit = i.toString().split('');
                var line = "\n " + emojiList[iSplit[0]] +
                            emojiList[iSplit[1]] + " " + link;
            }
            findResults += line;
        }
        return findResults;
    }

    // TODO - move to a flat array and filter it
    //findMatchingTopicName: function(keyword) {
    //    keyword = Utils.asFileName(keyword);
    //    var topicNames = KBase.topicNameList.filter(function(t){
    //        var flag = (t.indexOf(keyword) !== -1);
    //        return flag;
    //    });
    //    var oneName = topicNames[0];
    //    return oneName;
    //},

    //search: function(keyword) {
    //    // TODO implement search
    //    console.log(KBase.allData);
    //    return "results from KBase";
    //}

};


KBase.initSync();

module.exports = KBase;


// older version wrapping a promise around core code didn't work

// init: function(callback) {

//     var glob = require("glob"),
//         options = null,
//         kbpath = __dirname + "/../../data/KBase.wiki/*md";  // FIXME - works relative?

//     // using glob for nested dirs
//     glob(kbpath, options, function (err, files) {
//         // clog("files> ", files);
//         KBase.files = files;

//         KBase.allData = {}
//         KBase.files.map(function(fpath) {
//             arr = fpath.split("/");
//             fname = arr[arr.length - 1];
//             topic = fname.replace(".md", "");
//             blob = {
//                 path: fpath,
//                 topic: topic,
//                 fname: fname,
//                 data: fs.readFileSync(fpath, "utf8")
//             }
//             KBase.allData[topic] = blob;
//             // clog("blob", blob);
//         });
//         // clog("topics", KBase.allData);
//         if (callback) {
//             callback(null, KBase.allData);
//         }
//     });
//     clog("done KB init");
// },

// initPromiseWrap: function() {
//     return new Promise(function (fulfill, reject) {
//         KBase.init(function(err, res) {
//             clog("KBase fulfilled", res)
//             fulfill(res);
//         })
//     })
//     // could also reject
// },

