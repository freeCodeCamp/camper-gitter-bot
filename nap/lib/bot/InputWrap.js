"use strict";

var Utils = require("../utils/Utils");


var InputWrap = {
    roomShortName: function(input) {
        // console.log("roomShortName.input > ", input);
        var name = input.message.room.name;
        name = name.split("/");
        name = name[1] || name[0];
        return (name);
    },

    fromUser: function(input) {
        var username;
        try {
            username = input.message.model.fromUser.username;
            username = "@" + username;
            return username;
        } catch (e) {
            Utils.error("InputWrap", "no fromUser", input);
        }
    },

    mentioned: function(input) {
        var names,
            mentions = input.message.model.mentions;
        if (mentions) {
            // TODO - build a list
            names = mentions.map(function(u) {
                // console.log(u);
                // return "@" + u.screenName;
            });
            return names;
        }
        return null;
    }

};

module.exports = InputWrap;

