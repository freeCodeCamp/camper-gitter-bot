"use strict";

// FIXME - this seems a bit hacky? 
// should be a passed in object?
// but needed for tests too so want this class self contained

var AppConfig = require('../../config/AppConfig');

var routes = {

    findRedirect: function(topic) {
        var topicObj = AppConfig.topics.findTopic(topic);
        var org = AppConfig.org;
        var url = "https://gitter.im/" + org + "/" + topicObj.room;
        var redir = {
            topicObj: topicObj,
            topic: topic,
            org: org,
            url: url
        }
        return redir;
    },

    init: function(app, bot) {
        var that = this;
        app.get('/test', function(req, res) {
            res.send("test");
        });

        // http://localhost:7000/in?topic=FreeCodecamp
        app.get("/in", function(req, res) {
            // console.log(req);
            var topic = req.query.topic,
                redir = that.findRedirect(topic);

            bot.say("----");
            bot.say("topic: **" + topic + "**");
            res.redirect(redir.url);

        })

        app.get('/topics', function(req, res) {
            // console.log("that", that);
            res.render('topics', {
                user: req.user,
                token: req.session.token,
                topics: AppConfig.topics.data
            });
        })
    }

}

module.exports = routes;