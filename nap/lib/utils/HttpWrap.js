"use strict";

var http = require('http');

var AppConfig = require("../../config/AppConfig");

var HttpWrap = {

    getApi: function(apiPath, callback) {

        var endPoint = {
            host: AppConfig.apiServer,
            path: apiPath
        };

        console.log("getApi", endPoint);
        return http.get(endPoint, function(response) {
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
