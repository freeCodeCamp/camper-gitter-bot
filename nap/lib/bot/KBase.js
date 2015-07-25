var fs = require("fs")

function clog(msg, obj) {
    obj = obj || "" ;
    console.log("KBase>", msg, obj);
}

var KBase = {
    files: [],

    init: function() {

        var glob = require("glob"),
            options = null,
            kbpath = __dirname + "/../../data/kbase.wiki/*md";  // FIXME - works relative?

        // using glob for nested dirs
        glob(kbpath, options, function (err, files) {
            clog("files> ", files);
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
            clog("topics", KBase.topics);
        });
    }
}

module.exports = KBase;
