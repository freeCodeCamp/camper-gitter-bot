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

    {
        title: "RegEx",
        name: "bothelp/RegEx",
        topics: ["regex", "strings"]
    },

    {
        title: "Bonfires",
        name: "bothelp/Bonfires",
        topics: ["bonfires",
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
        ]
    }

];

// alias
RoomData.defaultRoom = RoomData[0];

// console.log("RoomData", RoomData);

module.exports = RoomData;
