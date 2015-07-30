"use strict";

var Settings = require('../../config/Settings');
var TextLib = require('../utils/TextLib');

var fs = require("fs"),
    Utils = require('../utils/Utils'),
    TextLib = require('../utils/TextLib');

function clog(msg, obj) {
    Utils.clog("Kbase", msg, obj);
}

var glob = require("glob");

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
                KBase.topicList = [];

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
                        data: data
                    };
                    KBase.topicList.push(topic);
                    KBase.topics[topic] = blob;
                    // clog("blob", blob);
                });
                // clog("topicList", KBase.topicList);
            });
            fulfill(KBase.topics);
        });
    },

    getTopicData: function(params) {
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
                KBase.getTopicData(name);  // dangerous
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
        var shortList = KBase.topicList.filter(function(t){
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
            var line = `\n[${i}] ${link}`;
            findResults += line;
        }
        return findResults;
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

