"use strict";

var http = require('http');

var HttpWrap = {

    getApi: function(endpoint, callback) {

        console.log("getApi", endpoint);
        return http.get(endpoint, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                callback(parsed);
            });
        });

    }

};

module.exports = HttpWrap;
