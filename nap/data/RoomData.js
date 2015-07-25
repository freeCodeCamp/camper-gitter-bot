"use strict";

var RoomData = [
    // 1st room is the default if we can't find anything else
    {
        title: "GeneralChat",
        path: "bothelp/GeneralChat",
        topics: ["default room"]
    },

    {
        title: "JS-Basics",
        path: "bothelp/JS-Basics",
        topics: ['objects', 'functions', 'prototype']
    },

    {
        title: "Frontend",
        path: "bothelp/Frontend",
        topics: ["css", "bootstrap", "html"]
    }

]

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);

module.exports = RoomData;
