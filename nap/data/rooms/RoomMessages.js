"use strict";

// the users input is scanned for these keywords
// and can trigger the messages below
// chance controls the frequency the result will be echoed back by the camper

// using js rather than json so we can have functions and comments

var Utils = require('../../lib/utils/Utils');
var _ = require('lodash-node');


// TODO - add these to all of the rooms
// this is easier for people to add content to as they don't have to add to two lists
var AllRoomMessages = [
    {
        // regex: /help.*bonfire:?s?[.?]$/i,
        regex: /help.*bonfire/i,
        text: " > type `bonfire name` to get some info on that bonfire. And check [HelpBonfires chatroom](https://gitter.im/FreeCodeCamp/HelpBonfires)",
        not: 'freecodecamp/HelpBonfires'  // optional to skip for this room
    },

    {
        regex: /botx/i,
        text: "> you called?",
    },

    {
        regex: /troll/i,
        text: "> :trollface: troll problems? [notify admins here](https://gitter.im/camperbot/admins)",
    },
    {
        regex: /allyourbase/,
        text: "![all your base](https://files.gitter.im/FreeCodeCamp/CoreTeam/Bw51/imgres.jpg)",
    },
    {
        regex: /'''/,
        text: "> :bulb: to format code use backticks! ``` [more info](https://github.com/freecodecamp/freecodecamp/wiki/code-formatting)",
    },
    {      
        regex: /holler/i,
        text: "> holler back!"
    }
]


var RoomMessages = {

    scanInput: function(input, roomName, chance) {
        if (Math.random() > chance) {
            return null;   // dont always reply
        }
        var oneMessage;
        var chat = input.message.model.text.toLowerCase();
        chance = chance || 1;
        roomName = roomName.toLowerCase();
        // var checkList = this.messagesPerRoomTable[roomName];

        var thisRoomMessages = AllRoomMessages.filter(function(msg) {
            if (msg.not) {
                return (msg.not != roomName);
            } else {
                return true;
            }
        });

        // _.merge(thisRoomMessages, checkList, AllRoomMessages);

        if (!thisRoomMessages) { return false; }
        var msgList = thisRoomMessages.filter(function(item) {
            if(!item) { return null; }

            //TODO - use a regex here
            // var flag = chat.includes(item.word) || item.regex.test(chat);
            Utils.clog("testing", item.regex, chat);
            if (item.regex) {
              var flag = item.regex.test(chat);            
            }

            if(flag) {
                //Utils.clog(chat, item.word, "flag:" + flag);
            }
            return flag;
        });
        
        // now check if chance is high enough
        if (msgList.length > 0) {

            //Utils.log('msgList', msgList);
            oneMessage = _.sample(msgList);
            chance = oneMessage.chance || 1;
            if (Math.random() < (chance)) {
                //Utils.clog("scanInput out>", oneMessage.word);
                return oneMessage.text;
            }
        } else {
            return null;
        }

    }

};

module.exports = RoomMessages;
