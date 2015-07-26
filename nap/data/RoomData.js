"use strict";

var RoomData = [
    // 1st room is the default if we can't find anything else
    {
        title: "GeneralChat",
        name: "bothelp/GeneralChat",
        topics: ["chitchat"]
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
    }

]

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);

module.exports = RoomData;
