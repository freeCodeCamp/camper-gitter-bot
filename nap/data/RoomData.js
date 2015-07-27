"use strict";

// from the webapp
// users enter the rooms with a topic=XXX url
// we find a matching room here with that topic
// and redirect them

var RoomData = [
    // 1st room is the default if we can't find anything else

    {
        title: "bothelp",
        name: "bothelp",
        topics: ["chitchat", "dm"]
    },

    {
        title: "Botdiscussion",
        name: "dcsan/botzy",
        topics: ['bots', 'fcc', 'teaching']
    },

    {
        title: "GeneralChat",
        name: "bothelp/GeneralChat",
        topics: ["general", "intros"]
    },

    {
        title: "JS-Basics",
        name: "bothelp/JS-Basics",
        topics: ['objects', 'functions', 'prototype']
    },

    {
        title: "Frontend",
        name: "bothelp/Frontend",
        topics: ["css", "bootstrap", "html"]
    },

    {
        title: "Testing",
        name: "bothelp/Testing",
        topics: ["chai", "TDD", "assert"]
    },

]

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);

module.exports = RoomData;
