# GitterBot for FCC

Join us in Gitter to discuss!
https://gitter.im/dcsan/gitterbot

## checking out
lets go!
ideally fork the project first on github and clone your fork.

    git clone git@github.com:dcsan/gitterbot.git

we use git submodules for some wiki data

    git submodule init
    git submodule update


## environment

we're using the latest es6 so best to get an up to date environment.
at the time of writing iojs was a bit ahead of node.

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

# Run the app in 'demobot' mode

    cd nap
    bin/run-demobot.sh

That's it! The app should be running at [http://localhost:7891](http://localhost:7891)

You can now visit your gitterbot via Gitter at [https://gitter.im/demobot/test](https://gitter.im/demobot/test)

But! This is using shared credentials, so you may find yourself in a chatroom with other people using the same IDs.

So to setup this up and use your own gitter login info, edit the file

    bin/credentials-demobot.sh

get your own API keys for gitter from:
[https://developer.gitter.im/apps](https://developer.gitter.im/apps)


There are some more detailed docs in docs/credentials.md on how to configure more details


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

readme tweak.


# Chat to us!

Ping me @dcsan in the [gitterbot chatroom](https://gitter.im/dcsan/gitterbot) if you get stuck.




