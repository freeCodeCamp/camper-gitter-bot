"use strict";

var TextLib = require('../utils/TextLib');

var fs = require("fs"),
    Utils = require('../utils/Utils'),
    TextLib = require('../utils/TextLib');

function clog(msg, obj) {
    Utils.clog("Kbase", msg, obj);
}

var glob = require("glob");

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


var KBase = {
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

    // has to be a promise so we can then.run tests after its fulfilled
    initAsync: function() {
        return new Promise(function (fulfill, reject) {
            // could also reject
            var options = null,
                kbpath = __dirname + "/../../data/wiki/*md";  // FIXME - works relative?

            // using glob for nested dirs
            glob(kbpath, options, function (err, files) {
                // clog("files> ", files);
                KBase.files = files;
                KBase.topicNameList = [];

                KBase.topics = {};
                KBase.files.map(function(fpath) {
                    var arr = fpath.split("/");
                    var fname = arr[arr.length - 1];
                    fname = fname.toLowerCase();
                    var topic = fname.replace(".md", "");
                    var data = fs.readFileSync(fpath, "utf8");
                    data = TextLib.trimLines(data);
                    var blob = {
                        path: fpath,
                        topic: topic,
                        fname: fname,
                        data: data,
                        shortData: TextLib.trimLines(data)
                    };
                    KBase.topicNameList.push(topic);
                    KBase.topics[topic] = blob;
                    // clog("blob", blob);
                });
                // clog("topicNameList", KBase.topicNameList);
            });
            fulfill(KBase.topics);
        });
    },

    getTopicData: function(params, recursing) {
        var res, name;
        name = Utils.asFileName(params);

        res = KBase.staticReplies[name];
        if (res) {
            return (res);
        }

        // FIXME - this is only first time
        if (!KBase.topics) {
            Utils.warn("loading kbase >");
            var p = KBase.initAsync();
            p.then(function() {
                Utils.warn("< loaded");
                if (recursing) {
                    // panic. couldn't load so don't go into a crazy loop
                    throw new Error("KBase couldn't load, quitting");
                }
                KBase.getTopicData(name, true);  // dangerous
                // return KBase.topics[name];
            });
        } else{
            // TODO - better matching algorithm
            // this has to be a perfect match
            var match = KBase.topics[name];
            // console.log(name, match);
            return match;
        }

    },

    findTopics: function(keyword) {
        var shortList = KBase.topicNameList.filter(function(t){
            return (t.indexOf(keyword) !== -1);
        });
        if (shortList.length === 0) {
            return "nothing found";
        }
        // else
        var findResults = "";
        for (var i = 0; i < shortList.length; i++) {
            var item = shortList[i];
            var link = Utils.linkify(item, 'wiki');
            var line = "\n[" + i + "] " + link;
            findResults += line;
        }
        return findResults;
    },

    search: function(keyword) {
        // TODO implement search
        console.log(KBase.topics);
        return "results from kbase";
    }

};

module.exports = KBase;




// older version wrapping a promise around core code didn't work

    // init: function(callback) {

    //     var glob = require("glob"),
    //         options = null,
    //         kbpath = __dirname + "/../../data/kbase.wiki/*md";  // FIXME - works relative?

    //     // using glob for nested dirs
    //     glob(kbpath, options, function (err, files) {
    //         // clog("files> ", files);
    //         KBase.files = files;

    //         KBase.topics = {}
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
    //             KBase.topics[topic] = blob;
    //             // clog("blob", blob);
    //         });
    //         // clog("topics", KBase.topics);
    //         if (callback) {
    //             callback(null, KBase.topics);
    //         }
    //     });
    //     clog("done KB init");
    // },

    // initPromiseWrap: function() {
    //     return new Promise(function (fulfill, reject) {
    //         KBase.init(function(err, res) {
    //             clog("Kbase fulfilled", res)
    //             fulfill(res);
    //         })
    //     })
    //     // could also reject
    // },

