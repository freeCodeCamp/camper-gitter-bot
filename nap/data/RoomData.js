"use strict";

// This file needs to be edited to comment out
// rooms you want to join

// TODO - move to lib/ dir?

var AppConfig = require('../config/AppConfig');

// var Bonfires = require('../lib/app/Bonfires');

// from the webapp
// users enter the rooms with a topic=XXX url
// we find a matching room here with that topic
// and redirect them

var RoomData;


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

var bonfireDashedNames = [
    "bonfire-meet-bonfire",
    "bonfire-reverse-a-string",
    "bonfire-factorialize-a-number",
    "bonfire-check-for-palindromes",
    "bonfire-find-the-longest-word-in-a-string",
    "bonfire-title-case-a-sentence",
    "bonfire-return-largest-numbers-in-arrays",
    "bonfire-confirm-the-ending",
    "bonfire-repeat-a-string-repeat-a-string",
    "bonfire-truncate-a-string",
    "bonfire-chunky-monkey",
    "bonfire-slasher-flick",
    "bonfire-mutations",
    "bonfire-falsey-bouncer",
    "bonfire-where-art-thou",
    "bonfire-seek-and-destroy",
    "bonfire-where-do-i-belong",
    "bonfire-sum-all-numbers-in-a-range",
    "bonfire-diff-two-arrays",
    "bonfire-roman-numeral-converter",
    "bonfire-search-and-replace",
    "bonfire-pig-latin",
    "bonfire-dna-pairing",
    "bonfire-missing-letters",
    "bonfire-boo-who",
    "bonfire-sorted-union",
    "bonfire-convert-html-entities",
    "bonfire-spinal-tap-case",
    "bonfire-sum-all-odd-fibonacci-numbers",
    "bonfire-sum-all-primes",
    "bonfire-smallest-common-multiple",
    "bonfire-finders-keepers",
    "bonfire-drop-it",
    "bonfire-steamroller",
    "bonfire-binary-agents",
    "bonfire-everything-be-true",
    "bonfire-arguments-optional",
    "bonfire-make-a-person",
    "bonfire-map-the-debris",
    "bonfire-pairwise",
    "bonfire-validate-us-telephone-numbers",
    "bonfire-symmetric-difference",
    "bonfire-exact-change",
    "bonfire-inventory-update",
    "bonfire-no-repeats-please",
    "bonfire-friendly-date-ranges"
];

var BotRoomData = {

    // this controls which rooms you can access
    YOUR_GITHUB_ID: [
        // change this to be a room your user is already in
        {
            title: "bothelp",
            name: "YOUR_GITHUB_ID/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        },

        {
            title: "bothelp",
            name: "bothelp/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        }
    ],

    // this is the demobot that ships with the app
    demobot: [
        {
            title: "demobot",
            name: "demobot/test",
            icon: "star",
            topics: ["getting started"]
        }
    ],

    // developer bot
    bothelp: [

        {
            title: "bothelp",
            name: "bothelp/testing",
            icon: "question",
            topics: ["chitchat", "bots", "bot-development", "camperbot"]
        },

        {
            title: "HelpBonfires",
            icon: "fire",
            name: "bothelp/HelpBonfires",
            topics: bonfireTopics
        },

        {
            title: "camperbot/localdev",
            name: "camperbot/localdev"
        },

        {
            title: "bothelpDM",
            name: "bothelp",
        },

        {
            title: "GeneralChat",
            name: "bothelp/GeneralChat",
        },

        // {
        //     title: "DataScience",
        //     name: "FreeCodeCamp/DataScience",
        //     topics: ["general", "DataScience"]
        // },

        {
            title: "PrivateRoomTest",
            private: true,
            name: "bothelp/PrivateRoomTest",
            topics: ["general", "intros"]
        },

        {
            title: "EdaanDemo",
            name: "egetzel/demo",
            private: true,
            topics: ['egdemo']
        },

        // Bonfire single rooms

        {
            name: "bothelp/bonfire-factorialize-a-number",
            topics: ['bonfire factorialize a number'],
            isBonfire: true,

        },

    ],

    camperbot: [

        // dev rooms
        {
            title: "Botdiscussion",
            name: "dcsan/botzy",
            private: true,
            topics: ['bots', 'fcc', 'teaching']
        },

        {
            name: "dcsan/gitterbot",
        },

        {
            name: "camperbot/devteam",
        },

        {
            name: "camperbot/testing",
        },

        {
            name: "FreeCodeCamp/DataScience",
            topics: ["general", "DataScience"]
        },

        {
            title: "SanFrancisco",
            name: "FreeCodeCamp/SanFrancisco",
            topics: ["sf", "crazy rents" ]
        },

        {
            title: "Help ZipLines",
            name: "camperbot/HelpZiplines",
            topics: ["ziplines"]
        },

        {
            title: "Help Bonfires",
            name: "FreeCodeCamp/HelpBonfires",
            topics: bonfireTopics
        },

        {
            title: "CoreTeam",
            name: "FreeCodeCamp/CoreTeam",
            private: true,
            topics: bonfireTopics
        },

        {
            title: "MainHelp",
            name: "FreeCodeCamp/Help",
            topics: ['bots', 'fcc']
        },
        
        {
            title:"LetsPair",
            name: "FreeCodeCamp/LetsPair",
            topics: ['pairing', 'fcc']
        },

        {
            title: "MainHelp",
            name: "FreeCodeCamp/Help",
            topics: ['bots', 'fcc']
        },

        {
            name: "freecodecamp/CodeReview"
        },

        {
            name: "FreeCodeCamp/Wiki"
        },
        {
            name: "FreeCodeCamp/CodeReview"
        },
        {
            name: "FreeCodeCamp/HalfWayClub"
        },
        {
            name: "FreeCodeCamp/LetsPair"
        },
        {
            name: "FreeCodeCamp/Welcome"
        },

        {            
            name: "FreeCodeCamp/HelpZiplines"
        },

        {
            title: "MainHelp",
            name: "FreeCodeCamp/FreeCodeCamp",
            topics: ['bots', 'fcc']
        }

        // {
        //     title: "HelpBonfires",
        //     name: "FreeCodeCamp/HelpBonfires",
        //     topics: bonfireTopics
        // },



    ]

};

var botname = null;

bonfireDashedNames.map(function(bfName) {
    var room = {
        name: "camperbot/" + bfName,
        isBonfire: true
    }
    BotRoomData.camperbot.push(room);
})

BotRoomData.camperbot.map(function(room) {
    room.title = room.title || room.name.split("/")[1];
    if (room.isBonfire) {
        //room.entry = "FreeCodeCamp/HelpBonfires",
        room.entry = "camperbot/testing",
        room.topic = room.title
    }
})

RoomData = {
    rooms: function(botname) {
        botname = botname || AppConfig.getBotName();
        return BotRoomData[botname];
    },

    defaultRoom: function() {
        return RoomData.rooms().rooms[0];
    }

};




module.exports = RoomData;

