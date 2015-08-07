"use strict";

// using js rather than json so we can have functions and comments

var Utils = require('../../lib/utils/Utils');
var _ = require('lodash-node');

var SharedMessages = {
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
        text: "> If you're having troll problems [notify admins here](https://gitter.im/camperbot/admins)",
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
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat,
            SharedMessages.backticks,
        ],

        'camperbot/localdev': [
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat,
            SharedMessages.backticks,
        ],

        'freecodecamp/help': [
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat,
            SharedMessages.backticks,
        ],

        'freecodecamp/HelpBonfires': [
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.meteorChat,
            SharedMessages.backticks,
        ],

        'FreeCodeCamp/CoreTeam': [
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.bonfireChat,
            SharedMessages.meteor,
            SharedMessages.backticks,
        ],

        'camperbot/devteam': [
            SharedMessages.holler,
            SharedMessages.troll,
            SharedMessages.bonfireChat,
            SharedMessages.meteor,
            SharedMessages.backticks,
        ],

        'camperbot/admins': [
            SharedMessages.troll,
            SharedMessages.bonfireChat,
        ],

    },

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
            var flag = (chat.includes(item.word));
            if(flag) {
                Utils.clog(chat, item.word, "flag:" + flag);
            }
            return flag;
        });
        if (msgList.length > 0) {
            // TODO order by 'chance' and pick highest
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
