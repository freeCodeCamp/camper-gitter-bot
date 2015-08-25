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

/*
 * Returns a prefixed room(s) with a common channel name.
 * e.g. <code>prefixChannelName("FreeCodeCamp", ["Help", "Bonfire"]);</code>
 * would output <code>["FreeCodeCamp/Help", "FreeCodeCamp/Bonfire"]</code>
 * and <code>prefixChannelName("FreeCodeCamp", "DataScience"]);</code>
 * would output <code>"FreeCodeCamp/DataScience"</code>
 *
 * @param {string} name Channel name in Gitter
 * @param {string|Array<string>} roomNames List of room names or a single room name
 * @return {string|Array<string>} The prefixed string or array of string
 */
function prefixChannelName(name, roomNames) {
    if (roomNames instanceof Array) {
        return roomNames.map(function (room) {
            return name + '/' + room;
        });
    }
    return name + '/' + roomNames;
}

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

<<<<<<< HEAD
var fccOfficialChatRoomNames = [
    "40PlusDevs",
    "Beta",
    "BookClub",
    "CodeReview",
    "CodingJobs",
    "CurriculumDevelopment",
    "DataScience",
    "Design",
    "FreeCodeCamp",
    "HalfWayClub",
    "Help",
    "HelpBasejumps",
    "HelpBonfires",
    "HelpZiplines",
    "Issues",
    "LetsPair",
    "LiveCoding",
    "News",
    "NonprofitProjects",
    "PairProgrammingWomen",
    "TeamViewer",
    "Wiki",
    "YouCanDoThis"
];

var fccCasualChatRoomNames = [

];

var fccMiscChatRoomNames = [
    "CoreTeam",
    "Welcome",
];

var fccCityChatRoomNames = [
    "Aarhus",
    "AbuDhabi",
    "Accra",
    "Adelaide",
    "Ahmedabad",
    "Aichi",
    "Albany",
    "Albuquerque",
    "Algiers",
    "Allahabad",
    "Almeria",
    "Amman",
    "Amsterdam",
    "Anacortes",
    "Ankara",
    "AnnArbor",
    "Apucarana",
    "Aracaju",
    "Asheville",
    "Asuncion",
    "Athens",
    "AthensOH",
    "Atlanta",
    "Auckland",
    "Aurora",
    "Austin",
    "Bacau",
    "Bakersfield",
    "Baku",
    "Baltimore",
    "Bandung",
    "Bangkok",
    "Barcelona",
    "Barranquilla",
    "Beirut",
    "Belem",
    "Belgrade",
    "Belize",
    "BelizeCity",
    "Bellingham",
    "BeloHorizonte",
    "Bengaluru",
    "Berlin",
    "Bhaktapur",
    "Bhubaneswar",
    "Bijeljina",
    "Birmingham",
    "BirminghamAlabama",
    "Bishkek",
    "Bismarck",
    "BloomingtonIN",
    "BloomingtonNormal",
    "BloomingtonNormal",
    "Bogota",
    "Boise",
    "Boston",
    "Boulder",
    "Brasilia",
    "Bratislava",
    "Brighton",
    "Brisbane",
    "Brno",
    "Brussels",
    "BryanCollegeStation",
    "Bucaramanga",
    "Bucharest",
    "Budapest",
    "BuenosAires",
    "Buffalo",
    "BuryStEdmunds",
    "Busan",
    "Bydgoszcz",
    "Cairo",
    "Calgary",
    "Cali",
    "Campinas",
    "Canberra",
    "CapeCod",
    "CapeTown",
    "Caracas",
    "Cardiff",
    "Casablanca",
    "CentralMississippi",
    "ChampaignUrbana",
    "Charlotte",
    "Chattanooga",
    "Chennai",
    "Chernivtsi",
    "ChiangMai",
    "Chicago",
    "Christchurch",
    "Christchurch",
    "Cincinnati",
    "Clarksville",
    "Cleveland",
    "Cluj",
    "Coimbatore",
    "Colombo",
    "ColoradoSprings",
    "Columbus",
    "Coventry",
    "Cuenca",
    "Curitiba",
    "DallasFortWorth",
    "DallasFortWorth",
    "Delhi",
    "Denver",
    "Derby",
    "DesMoines",
    "Detroit",
    "Dhaka",
    "Dnipropetrovsk",
    "Doha",
    "Dubai",
    "Dublin",
    "Durango",
    "EastBay",
    "EastBay",
    "EastBay",
    "Edinburgh",
    "Edmonton",
    "ElPaso",
    "Evansville",
    "FCCLosAngeles",
    "Farmville",
    "Fayetteville",
    "Ferizaj",
    "Firenze",
    "Florianopolis",
    "Folsom",
    "FortCollins",
    "Frankfort",
    "Frankfurt",
    "Freehold",
    "Fresno",
    "Fuengirola",
    "GainesvilleFL",
    "Galveston",
    "Geneva",
    "Glendora",
    "Goettingen",
    "Granada",
    "GrandRapids",
    "Guadalajara",
    "Guarapuava",
    "GuatemalaCity",
    "Guntur",
    "Gurgaon",
    "Hagerstown",
    "Halifax",
    "Hamburg",
    "HamptonRoads",
    "Hanoi",
    "Harcourt",
    "Hartford",
    "Hermosillo",
    "Hickory",
    "HoChiMinhCity",
    "Hobart",
    "HongKong",
    "Houston",
    "Hove",
    "Huntsville",
    "Hyderabad",
    "Iasi",
    "IdahoFalls",
    "Indianapolis",
    "Ipswich",
    "Irkutsk",
    "Isfahan",
    "Islamabad",
    "Istanbul",
    "IvanoFrankivsk",
    "Izmir",
    "JacksonMS",
    "Jacksonville",
    "Jaffna",
    "Jaipur",
    "Jakarta",
    "Jerusalem",
    "JoaoPessoa",
    "Johannesburg",
    "Juarezchi",
    "Kaduna",
    "Kalamazoo",
    "Kampala",
    "KansasCity",
    "Karachi",
    "Kathmandu",
    "Kemerovo",
    "Kerch",
    "Kiev",
    "KingstonON",
    "Knoxville",
    "Koeln",
    "Kolkata",
    "Kosovo",
    "Kozhikode",
    "Krasnodar",
    "KryvyiRih",
    "KualaLumpur",
    "LaCrosse",
    "LaPaz",
    "Lae",
    "Lagos",
    "Lahore",
    "Lakeland",
    "LasCruces",
    "LasVegas",
    "Lawrence",
    "Leesburg",
    "Leesville",
    "Lehi",
    "Lexington",
    "Lima",
    "Limassol",
    "Lindsay",
    "Lisbon",
    "LittleRock",
    "London",
    "LosAlamos",
    "Louisville",
    "Luanda",
    "Lubbock",
    "Lviv",
    "Madison",
    "Madrid",
    "Manchester",
    "Manila",
    "Melbourne",
    "MexicoCity",
    "Miami",
    "Milan",
    "Milwaukee",
    "Minneapolis",
    "Minsk",
    "MississippiGulfCoast",
    "Missoula",
    "Modesto",
    "Monterrey",
    "Montevideo",
    "Montgomery",
    "Montreal",
    "Moosejaw",
    "MorganCity",
    "Moscow",
    "MossPoint",
    "Multan",
    "Mumbai",
    "Munich",
    "Mysore",
    "Nairobi",
    "Napoli",
    "Nashik",
    "Nashville",
    "NewBrunswick",
    "NewHaven",
    "NewOrleans",
    "NewPaltz",
    "NewWestminster",
    "NewYorkCity",
    "Nicosia",
    "Noida",
    "NorthMississippi",
    "NorthPlatte",
    "NorthernArizona",
    "NorthernArizona",
    "NorthernArizona",
    "NorthernArizona",
    "OklahomaCity",
    "Olympia",
    "Omaha",
    "OrangeCounty",
    "Orlando",
    "Ottawa",
    "PanamaCity",
    "Parana",
    "Paris",
    "Pasadena",
    "Pasto",
    "Penang",
    "Perth",
    "Perugia",
    "Philadelphia",
    "Phoenix",
    "Phoenix",
    "Phoenix",
    "Pittsburgh",
    "Poitiers",
    "Pondicherry",
    "Portland",
    "Porto",
    "PortoAlegre",
    "Prague",
    "Pristina",
    "Providence",
    "Provo",
    "Puebla",
    "Pune",
    "Quibdo",
    "Raleigh",
    "Ranchi",
    "Reading",
    "Recife",
    "RedmondOR",
    "Reno",
    "RiceLake",
    "Richmond",
    "RiodeJaneiro",
    "RiversideCA",
    "RochesterNY",
    "Roma",
    "Rotterdam",
    "Sacramento",
    "SaintGeorge",
    "SaintLouis",
    "SaintPaul",
    "Salamanca",
    "SalisburyMD",
    "SaltLakeCity",
    "Salvador",
    "SanAntonio",
    "SanBernardino",
    "SanDiego",
    "SanFrancisco",
    "SanJose",
    "SanJoseCostaRica",
    "SanJuan",
    "SanLuisObispo",
    "SantaBarbara",
    "SantaCruz",
    "Santiago",
    "SantoDomingo",
    "SaoPaulo",
    "Savannah",
    "Seattle",
    "Seoul",
    "Shanghai",
    "Sheffield",
    "Sidoarjo",
    "SierraVista",
    "Singapore",
    "Skopje",
    "Solo",
    "SouthBend",
    "Spartanburg",
    "Srinagar",
    "StCloud",
    "StrokeOnTrent",
    "Struga",
    "Stuttgart",
    "Surabaya",
    "Surrey",
    "Sydney",
    "SydneyNS",
    "Taipei",
    "Tallahassee",
    "Tallinn",
    "Tampa",
    "Tashkent",
    "Tegucigalpa",
    "Tehran",
    "TelAviv",
    "Temecula",
    "Thessaloniki",
    "Ticino",
    "Tijuana",
    "Timisoara",
    "Tirana",
    "Tokyo",
    "TomsRiver",
    "Torino",
    "Toronto",
    "TriCitiesWashington",
    "Trivandrum",
    "Trojmiasto",
    "Trojmiasto",
    "Trojmiasto",
    "Tucson",
    "Tulsa",
    "Tunis",
    "UniversityCenter",
    "Valdosta",
    "Valencia",
    "Vancouver",
    "Victoria",
    "Vilnius",
    "VirginiaBeach",
    "Vitoria",
    "Vladivostok",
    "Warrington",
    "Warsaw",
    "WashingtonDC",
    "Waterford",
    "Wichita",
    "Winnipeg",
    "Wuerzburg",
    "Yangon",
    "Yaounde",
    "Yekaterinburg",
    "Yerevan",
    "Zagreb",
    "Znojmo",
    "Zurich"
];

var fccChatRooms = {
    officialChatRooms: prefixChannelName("FreeCodeCamp",
        fccOfficialChatRoomNames),
    casualChatRooms: prefixChannelName("FreeCodeCamp",
        fccCasualChatRoomNames),
    cityChatRooms: prefixChannelName("FreeCodeCamp", fccCityChatRoomNames),
};

var camperBotChatRoomNames = [
    "HelpZiplines",
    "devteam",
    "testing"
];

var otherChatRooms = [
    "dcsan/botzy",
    "dcsan/gitterbot"
];

var camperBotChatRooms = prefixChannelName("camperbot", camperBotChatRoomNames);

// @TODO Refactor into a room generator function
var camperBotRooms = [
    camperBotChatRooms,
    fccChatRooms.officialChatRooms,
    fccChatRooms.cityChatRooms,
    fccChatRooms.casualChatRooms,
    otherChatRooms
].reduce(function (rooms, currRooms) {
    return rooms.concat(currRooms);
}).map(function (room) {
    return {
        name: room
    };
});
=======
// TODO - probably easier to refactor these as an array of entries
// since we aren't using the title/icon etc fields anymore
>>>>>>> rel-012

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
    demobot: [{
        title: "demobot",
        name: "demobot/test",
        icon: "star",
        topics: ["getting started"]
    }],

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
            name: "bothelp/PrivateRoomTest",
            topics: ["general", "intros"]
        },

        {
            title: "EdaanDemo",
            name: "egetzel/demo",
            topics: ['egdemo']
        },

        // Bonfire single rooms

        {
            name: "bothelp/bonfire-factorialize-a-number",
            topics: ['bonfire factorialize a number'],
            isBonfire: true,
        },

    ],

<<<<<<< HEAD
    camperbot: camperBotRooms
=======
    camperbot: [

        {
            title: "MainHelp",
            name: "FreeCodeCamp/FreeCodeCamp",
            topics: ['bots', 'fcc']
        },

        {
            title: "Help Bonfires",
            name: "FreeCodeCamp/HelpBonfires",
            topics: bonfireTopics
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
            title: "CoreTeam",
            name: "FreeCodeCamp/CoreTeam",
            private: true,
            topics: bonfireTopics
        },

        {
            name: "FreeCodeCamp/Help",
        },
        
        {
            name: "FreeCodeCamp/LetsPair",
        },

        {
            name: "FreeCodeCamp/Help",
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
            name: "HelpBasejumps"
        },
        {
            name: "NonprofitProjects"
        },
        {
            name: "CodingJobs"
        },
        {
            name: "YouCanDoThis"
        },
        {
            name: "News"
        },
        {
            name: "TeamViewer"
        },
        {
            name: "PairProgrammingWomen"
        },
        {
            name: "40PlusDevs"
        },
        {
            name: "LiveCoding"
        },

           // dev rooms
        {
            title: "Botdiscussion",
            name: "dcsan/botzy",
            private: true,
            topics: ['bots', 'fcc', 'teaching']
        },

        // {
        //     title: "HelpBonfires",
        //     name: "FreeCodeCamp/HelpBonfires",
        //     topics: bonfireTopics
        // },



    ]
>>>>>>> rel-012

};

var botname = null;

bonfireDashedNames.map(function (bfName) {
    var room = {
        name: "camperbot/" + bfName,
        isBonfire: true
    };
    BotRoomData.camperbot.push(room);
});

BotRoomData.camperbot.map(function (room) {
    room.title = room.title || room.name.split("/")[1];
    if (room.isBonfire) {
        //room.entry = "FreeCodeCamp/HelpBonfires",
        room.entry = "camperbot/testing";
        room.topic = room.title;
    }
});

RoomData = {
    rooms: function (botname) {
        botname = botname || AppConfig.getBotName();
        return BotRoomData[botname];
    },

    defaultRoom: function () {
        return RoomData.rooms().rooms[0];
    }

};

module.exports = RoomData;
