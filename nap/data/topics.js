"use strict";

var topics = {

    findTopic: function(topic) {
        var topic = this.data[topic];
        if (topic) {
            // console.log("found topic", topic);
            return topic;
        }
        return (this.data.defaultTopic);
    },

    // TODO - read external YAML file
    data: {
        'defaultTopic': {
            title: "defaultTopic",
            room: "botzy"
        },
        "objects": {
            title: "objects",
            room: "JS-basics"
        },
        "functions": {
            title: "functions",
            room: "JS-basics"
        },
        "bootstrap": {
            title: "bootstrap",
            room: "front-end"
        },
        "css frameworks": {
            title: "CSS Frameworks",
            room: "front-end"
        }

    }
}

for (var topic in topics.data) {
    topic.room = "botzy";
}

// console.log(topics);

module.exports = topics;