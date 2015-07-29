"use strict";


var InputWrap = {
    roomShortName: function(input) {
        // console.log("roomShortName.input > ", input);
        var name = input.message.room.name;
        name = name.split("/");
        name = name[1] || name[0];
        return (name);
    }

};

module.exports = InputWrap;

