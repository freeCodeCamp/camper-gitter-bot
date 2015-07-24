var bot = {
    reply: function(input) {
        console.log("bot.input: ", input);
        return("input>" + input + " | reply> random");
    }
}

module.exports = bot;