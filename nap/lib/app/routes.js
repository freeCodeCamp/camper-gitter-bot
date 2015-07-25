"use strict";


var routes = {
    init: function(app, bot) {
        app.get('/test', function(req, res) {
            res.send("test");
        });

        // http://localhost:7000/in?topic=FreeCodecamp
        app.get("/in", function(req, res) {
            console.log(req);
            var topic = req.query.topic,
                user = "FreeCodeCamp",
                room = topic || "FreeCodeCamp";

            var url = "https://gitter.im/" + user + "/" + room;
            bot.say("# topic: " + topic);
            res.redirect(url);

        })
    }


}

module.exports = routes;