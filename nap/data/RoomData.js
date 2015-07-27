"use strict";

var RoomData = [
    // 1st room is the default if we can't find anything else

    {
        title: "bothelp",
        name: "bothelp",
        topics: ["chitchat", "dm"]
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
        title: "Botdiscussion",
        name: "dcsan/botzy",
        topics: ['bots', 'fcc', 'teaching']
    },

]

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);

module.exports = RoomData;
