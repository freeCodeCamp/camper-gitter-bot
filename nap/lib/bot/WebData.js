    about: function (input, bot) {
        // var mentioned = InputWrap.mentioned(input);
        var mentions, uri, str,res, them, blob, name;
        mentions = input.message.model.mentions;
        them = mentions[0];
        if (!them) {
            return "you need to ask about @someone!";
        }
        clog('them', them);
        // name = "berkeleytrue";
        name = them.screenName.toLowerCase();
        uri = "http://beta.freecodecamp.com/api/users/about?username=" + name;
        clog("uri", uri);

        var request = httpSync.request({
            method: 'GET',
            headers: {},
            body: '',
            protocol: 'http',
            host: 'beta.freecodecamp.com',
            port: 80, //443 if protocol = https
            path: '/api/users/about?username=' + name
        });

        var timedout = false;
        request.setTimeout(1000, function() {
            clog("Request Timedout!");
            timedout = true;
        });
        var response = request.end();
        if (!timedout) {
            clog('response', response);
            console.log(response.body.toString());
        }
        // return `unknown user: ${name}`;

        blob = JSON.parse(response.body.toString() );
        clog("res", blob);

        str = `
----

![${them}](https://avatars2.githubusercontent.com/${them}?&s=128) |## [${name}](http://www.freecodecamp.com/${name})
------------- | -------------
[github](${blob.about.github})  | bio: ${blob.about.bio}
----
        `;

        return str;

        // return "about " + mentioned[0];
    },
