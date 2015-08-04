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
    }
};

var RoomMessages = {

    rooms: {
        'camperbot/testing': [
            {
                word: 'holler',
                text: "> holler back!",
                chance: 1
            },
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat
        ],

        'camperbot/localdev': [
            {
                word: 'holler',
                text: "> holler back!",
                chance: 1
            },
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat
        ],

        'freecodecamp/help': [
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat
        ],

        'freecodecamp/helpbonfires': [
            SharedMessages.bonfireChat,
            SharedMessages.meteorChat
        ],

    },

    scanInput: function(input, room, chance) {
        if (Math.random() > chance) {
            return null;   // dont always reply
        }
        var res;
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
            res = _.sample(msgList);
            if (Math.random() < (res.chance || 1)) {
                Utils.clog("scanInput out>", res.word);
                return res.text;
            }
        } else {
            return null;
        }

    }

};

module.exports = RoomMessages;
