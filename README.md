# GitterBot!

This is a full featured bot for Gitter.
Main features:
- integration with github Wiki
- search, find
- wrapper for commands

The GBot is integrated into FreeCodeCamp

Join us in Gitter to discuss!
https://gitter.im/dcsan/gitterbot

# Introducing GitterBot!

GitterBot is a full featured bot for Gitter.im First developed to integrate with the chatrooms [for FreeCodeCamp, the largest online bootcamp in the world,](https://twitter.com/FreeCodeCamp/status/627338604134559744) where he supports more than 15,000 users in the main chatroom.

### Github Wiki Search

You can search for articles in a projects github wiki![](images/anims/find.gif)

### Share wiki summaries in chat

Use `explain` to pull a wiki summary right into the chat:![](images/anims/explain.gif)

### Points system

Allow your users to send points to each other to say 'thanks @friend'![](images/anims/points.gif)

### Fixed messages

Based on scannable expressions, send messages into the chat.

### Extensible

Custom functions can easily be added. Check the [System overview](https://github.com/dcsan/gitterbot#system-overview)  
 or contact [RIKAI Labs](mailto:dc@rikai.co).

## Installation instructions

To run GitterBot, you need [Node.js](https://nodejs.org/) before downloading the app.

### Windows

To install Node.js on Windows, follow these instructions: [http://blog.teamtreehouse.com/install-node-js-npm-windows](http://blog.teamtreehouse.com/install-node-js-npm-windows).

 - To download the app, clone the repository the bot is in:

        git clone https://github.com/dcsan/gitterbot.git

 -  Run the following commands to run the app:

        cd gitterbot
        cd nap
        ren dot-EXAMPLE.env dot.env
        node app.js

 - That's it! The app should be running at [http://localhost:7891](http://localhost:7891).

You can now chat to your gitterbot via Gitter at
[https://gitter.im/demobot/test](https://gitter.im/demobot/test)


### Mac

- To install Node, follow the instructions here: [http://blog.teamtreehouse.com/install-node-js-npm-mac](http://blog.teamtreehouse.com/install-node-js-npm-mac)

- To download the app, clone the repository the bot is in:

        git clone git@github.com:dcsan/gitterbot.git

- Run the following commands to run the app:

        cd gitterbot
        cd nap
        cp dot-EXAMPLE.env dot.env
        node app.js

 - That's it! The app should be running at [http://localhost:7891](http://localhost:7891).

You can now chat to your gitterbot via Gitter at
[https://gitter.im/demobot/test](https://gitter.im/demobot/test)


# Getting your own appID
This is using shared login as "demobot" so you may find yourself in a chatroom with other people using the same ID!

To setup this up and use your own gitter login info, you should create your own Gitter API key on their developer site, and replace the info in that `.env` file. Get your own API keys for gitter from: [https://developer.gitter.im/apps](https://developer.gitter.im/apps)

For more settings info, checkout the `AppConfig.js` and `RoomData.js` files. These define which rooms the bot will listen in to.
You can ping us in the Dev Chatroom if you have problems [gitterbot chatroom](https://gitter.im/dcsan/gitterbot) .


# Running tests

There are other commands in `bin` for running tests with the right config files etc
To run the tests with the right configs

    $ bin/test.sh


# Wiki Content
The wiki content is pulled in from FCC's wiki using a git submodule
But then we just copy it and commit it back to the main app as submodules are nasty to deal with on production servers.

    bin/wiki-update.sh



# System Overview

### data/RoomData.js
The list of rooms your bot is going to join.
Very starting your own bot, create a test room to enter and debug with.
This needs to be changed so you would only join your own rooms, otherwise developers will get into a situation where everyone is joining the same rooms and the bots go crazy talking to each other!

### lib/bot/BotCommands.js
This is where you add things that the bot can do. Some commands are broken into separate files such as `cmds/thanks` and `cmds/about`.
Each command gets a `input` which is a blob of data including what the user entered, and a bot instance.

### KBase.js
The Knowledge base. This is an interface to all the data in the wiki.

### How commands are called

In GBot.js

        if (input.command) {
            // this looks up a command and calls it
            output = BotCommands[input.keyword](input, this);
        } else {

BotCommands is a list of functions, eg

    BotCommands.thanks = function() { ... }

where `input.keyword` is `thanks` then

`BotCommands[input.keyword]` is like saying `BotCommands.thanks()`

so then the params get also added in `(input, this)` so its


    BotCommands[input.keyword](input, this);
    //becomes
    BotCommands.thanks(input, bot);

All of the botCommands expect these two params eg in thanks.js

    var commands = {
        thanks: function (input, bot) {



## environment notes

### wiki data
we use git submodules for some wiki data. to get these submodules you would do:

    git submodule init
    git submodule update


### ES6 and iojs

we're using the latest es6 so best to get an up to date environment.
at the time of writing iojs was a bit ahead of node.
its recommended to run on iojs rather than the older node.


```bash
# ubuntu
sudo apt-get upgrade
sudo apt-get install build-essential
```

we're using n to update node [article](http://davidwalsh.name/upgrade-nodejs)
We use n to manage iojs and node:
```
sudo npm install -g n
sudo n io latest
iojs -v
    // should be at least v2.4.0
```



# Chat to us!

Ping me @dcsan in the [gitterbot chatroom](https://gitter.im/dcsan/gitterbot) if you get stuck.
