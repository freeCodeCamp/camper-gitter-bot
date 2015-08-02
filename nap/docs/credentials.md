# Setting up login credentials

Apologies as this is a bit unclean right now. 

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


