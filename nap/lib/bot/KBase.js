var fs = require("fs"),
    Utils = require('../utils/Utils');

function clog(msg, obj) {
    Utils.clog("Kbase", msg, obj)
}

var KBase = {
    files: [],

    init: function(callback) {

        var glob = require("glob"),
            options = null,
            kbpath = __dirname + "/../../data/kbase.wiki/*md";  // FIXME - works relative?

        // using glob for nested dirs
        glob(kbpath, options, function (err, files) {
            // clog("files> ", files);
            KBase.files = files;

            KBase.topics = {}
            KBase.files.map(function(fpath) {
                arr = fpath.split("/");
                fname = arr[arr.length - 1];
                topic = fname.replace(".md", "");
                blob = {
                    path: fpath,
                    topic: topic,
                    fname: fname,
                    data: fs.readFileSync(fpath, "utf8")
                }
                KBase.topics[topic] = blob;
                // clog("blob", blob);
            });
            // clog("topics", KBase.topics);
            if (callback) {
                callback(null, KBase.topics);
            }
        });
        clog("done KB init");
    },

    initPromiseWrap: function() {
        return new Promise(function (fulfill, reject) {
            KBase.init(function(err, res) {
                clog("Kbase fulfilled", res)
                fulfill(res);
            })
        })
        // could also reject
    },


    initPromise: function() {
        return new Promise(function (fulfill, reject) {
            // could also reject
            var glob = require("glob"),
                options = null,
                kbpath = __dirname + "/../../data/kbase.wiki/*md";  // FIXME - works relative?

            // using glob for nested dirs
            glob(kbpath, options, function (err, files) {
                // clog("files> ", files);
                KBase.files = files;

                KBase.topics = {}
                KBase.files.map(function(fpath) {
                    arr = fpath.split("/");
                    fname = arr[arr.length - 1];
                    topic = fname.replace(".md", "");
                    blob = {
                        path: fpath,
                        topic: topic,
                        fname: fname,
                        data: fs.readFileSync(fpath, "utf8")
                    }
                    KBase.topics[topic] = blob;
                    // clog("blob", blob);
                });
                clog("initPromise fulfill");
                fulfill(KBase.topics);
            });    
        })
    },

    getTopic: function(name) {
        return KBase.topics[name];
    }

}

module.exports = KBase;
