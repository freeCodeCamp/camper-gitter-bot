# GitterBot for FCC

Join us in Gitter to discuss!
https://gitter.im/dcsan/gitterbot

## checking out
we use git submodules for some wiki data, so use:

    git clone
    git submodule init
    git submodule update


## environment

we're using the latest es6 so best to get an up to date environment.
at the time of writing iojs was a bit ahead of node so:

```bash
# ubuntu
sudo apt-get upgrade
sudo apt-get install build-essential
```
on the mac you may not need to do that, but update npm to be sure.

We use n to manage iojs installation:
```
sudo npm install -g n
sudo n io latest
```

# Setting up login credentials

Apologies as this is a bit unclean right now. Ping me in the [chatroom](https://gitter.im/dcsan/gitterbot) if you get stuck.

You'll need to get a gitter.im token to use for your bot.
create a new app here
https://developer.gitter.im/apps

Now make a copy of the `bin/credentials-example` file.
Save it as credentials-YOUR_GITHUB_ID
and fill in the fields.

Look in the file data/RoomData.js

```js
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
```

once that's setup you should be able to run the app from this script

    $ bin/run-YOUR_GITHUB_ID.sh

Then access your new room in the web browser

        http://gitter.im/YOUR_GITHUB_ID/testing

Of course in all this, you should change YOUR_GITHUB_ID to your actual github ID!
(Or better, make a separate github account for purposes of testing the bot)

You can see in this commit as I tagged the areas which needed changing to make this generic.
https://github.com/dcsan/gitterbot/commit/4af309c3a068d35207ca6be150446e1e059e85cd

When you start the server the default is to run on port 7891
You don't have to deploy this server anywhere - it will connect to gitter.im 



# Running tests

There are other commands in `bin` for running tests with the right config files etc
To run the tests with the right configs

    $ bin/test.sh


# Wiki Content
The wiki content is pulled in from FCC's wiki using a git submodule
But then we just copy it and commit it back to the main app as submodules are nasty to deal with on production servers.

    bin/wiki-update.sh


# System Overview

### RoomData.js
The list of rooms your bot is going to join.
Very starting your own bot, create a test room to enter and debug with.
This needs to be changed so you would only join your own rooms, otherwise developers will get into a situation where everyone is joining the same rooms and the bots go crazy talking to each other!

### BotCommands.js
This is where you add things that the bot can do. Some commands are broken into separate files such as `thanks` and `about`.


Sorry that these docs are very lightweight right now.
To understand the system some basic places to look.

