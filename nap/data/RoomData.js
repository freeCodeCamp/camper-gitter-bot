"use strict";

// TODO - move to lib/ dir?

var AppConfig = require('../config/AppConfig');

// var Bonfires = require('../lib/app/Bonfires');

// from the webapp
// users enter the rooms with a topic=XXX url
// we find a matching room here with that topic
// and redirect them

var RoomData,
    listenRoom;

// TODO - read this from the JSON file
var bonfireTopics = [
    "bonfires",
    "Pair Program on Bonfires",
    "Meet Bonfire",
    "Reverse a String",
    "Factorialize a Number",
    "Check for Palindromes",
    "Find the Longest Word in a String",
    "Title Case a Sentence",
    "Return Largest Numbers in Arrays",
    "Confirm the Ending",
    "Repeat a string repeat a string",
    "Truncate a string",
    "Chunky Monkey",
    "Slasher Flick",
    "Mutations",
    "Falsey Bouncer",
    "Where art thou",
    "Seek and Destroy",
    "Where do I belong",
    "Sum All Numbers in a Range",
    "Diff Two Arrays",
    "Roman Numeral Converter",
    "Search and Replace",
    "Pig Latin",
    "DNA Pairing",
    "Missing letters",
    "Boo who",
    "Sorted Union",
    "Convert HTML Entities",
    "Spinal Tap Case",
    "Sum All Odd Fibonacci Numbers",
    "Sum All Primes",
    "Smallest Common Multiple",
    "Finders Keepers",
    "Drop it",
    "Steamroller",
    "Binary Agents",
    "Everything Be True",
    "Arguments Optional"
];


var BotRoomData = {

    // developer bot
    bothelp: [
        {
            title: "bothelp",
            name: "camperbot/testing",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        },

        {
            title: "bothelp",
            name: "camperbot/HelpBonfires",
            topics: bonfireTopics
        },

        {
            title: "dev2",
            name: "bothelp/dev2",
            topics: ["bonfires", "hello-bonfires"]
        },

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
        }
    ],

    camperbot: [

        {
            title: "Botdiscussion",
            name: "dcsan/botzy",
            topics: ['bots', 'fcc', 'teaching']
        },

        {
            title: "Help Bonfires",
            name: "camperbot/testing",
            topics: ["bonfires", "hello-bonfires", "testing"]
        },

        {
            title: "Help Bonfires",
            name: "camperbot/HelpBonfires",
            topics: bonfireTopics
        },

        {
            title: "Help ZipLines",
            name: "camperbot/HelpZiplines",
            topics: ["bonfires", "hello-bonfires"]
        }

    ]

};




// filter rooms to listen to if a cmd line arg was passed in
// for development
var botname = AppConfig.botname;

console.log("loading RoomData for " + botname);

RoomData = BotRoomData[botname];

// if (listenRoom) {
//     RoomData = AllRoomData.filter(function(rm) {
//         return (rm.name === listenRoom);
//     });
//     console.log("LISTEN_ROOM only:", RoomData);
// } else {
//     RoomData = AllRoomData;
// }

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);
module.exports = RoomData;
