"use strict";

// using js rather than json so we can have functions and comments

var Utils = require('../../lib/utils/Utils');
var _ = require('lodash-node');


// TODO - add these to all of the rooms
// this is easier for people to add content to as they don't have to add to two lists
var AllRoomMessages = {
    test: {
        regex: /help.*bonfires?[.?]$/,
        text: "> type `bonfire name` to get some info on that bonfire. And check [HelpBonfires chatroom](https://gitter.im/FreeCodeCamp/HelpBonfires)",
    }
};



// these messages only exist in certain rooms
var SpecificRoomMessages = {

    bonfireChat: {
        word: 'bonfire',
        // text: "> we have bonfire specific chatroom here [FreeCodeCamp/HelpBonfires](https://gitter.im/FreeCodeCamp/HelpBonfires)",
        text: "> type `bonfire name` to get some info on that bonfire. And check [HelpBonfires chatroom](https://gitter.im/FreeCodeCamp/HelpBonfires)",
        chance: 0.2
    },
    meteorChat: {
        word: 'meteor',
        text: "> we have a meteor channel here: [camperbot/meteorJS](https://gitter.im/camperbot/meteorJS)",
        chance: 1
    },
    troll: {
        word: 'troll',
        text: "> :trollface: troll problems? [notify admins here](https://gitter.im/camperbot/admins)",
        chance: 1
    },
    holler: {
        word: 'holler',
        text: "> holler back!",
        chance: 1
    },
    backticks: {
        word: "'''",
        text: "> :bulb: to format code use backticks! ``` [more info](https://github.com/freecodecamp/freecodecamp/wiki/code-formatting)",
        chance: 1
    }

};

var RoomMessages = {

    rooms: {
        'camperbot/testing': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
            SpecificRoomMessages.meteorChat,
            SpecificRoomMessages.backticks,
        ],

        'camperbot/localdev': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
            SpecificRoomMessages.meteorChat,
            SpecificRoomMessages.backticks,
        ],

        'freecodecamp/help': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
            SpecificRoomMessages.meteorChat,
            SpecificRoomMessages.backticks,
        ],

        'freecodecamp/HelpBonfires': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.meteorChat,
            SpecificRoomMessages.backticks,
        ],

        'FreeCodeCamp/CoreTeam': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
            SpecificRoomMessages.meteor,
            SpecificRoomMessages.backticks,
        ],

        'camperbot/devteam': [
            SpecificRoomMessages.holler,
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
            SpecificRoomMessages.meteor,
            SpecificRoomMessages.backticks,
        ],

        'camperbot/admins': [
            SpecificRoomMessages.troll,
            SpecificRoomMessages.bonfireChat,
        ],

    },

    //TODO - add in the AllRoomMessages to the data structure being scanned

    scanInput: function(input, room, chance) {
        if (Math.random() > chance) {
            return null;   // dont always reply
        }
        var oneMessage;
        var chat = input.message.model.text.toLowerCase();
        chance = chance || 1;
        room = room.toLowerCase();
        var checkList = this.rooms[room];
        if (!checkList) { return false; }
        var msgList = checkList.filter(function(item) {
            if(!item) { return null; }
            //TODO - use a regex here
            var flag = (chat.includes(item.word));
            if(flag) {
                Utils.clog(chat, item.word, "flag:" + flag);
            }
            return flag;
        });
        
        // now check if chance is high enough
        if (msgList.length > 0) {

            //Utils.log('msgList', msgList);
            oneMessage = _.sample(msgList);
            chance = oneMessage.chance || 1;
            if (Math.random() < (chance)) {
                Utils.clog("scanInput out>", oneMessage.word);
                return oneMessage.text;
            }
        } else {
            return null;
        }

    }

};

module.exports = RoomMessages;
