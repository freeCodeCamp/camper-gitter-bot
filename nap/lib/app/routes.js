"use strict";


var routes = {
    init: function(app, bot) {
        app.get('/test', function(req, res) {
            res.send("test");
        });

        app.get("/in", function(req, res) {
            console.log(req);
            var topic = req.query.topic;
            bot.say("# " + topic);
            res.send("in topic=" + topic);
        })
    }


}

module.exports = routes;