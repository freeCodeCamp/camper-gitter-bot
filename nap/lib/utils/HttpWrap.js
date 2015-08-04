"use strict";

var http = require('http');
var _ = require('lodash-node');

var AppConfig = require("../../config/AppConfig"),
    Utils = require("./Utils");


var HttpWrap = {

    defaultOptions: {
        host: AppConfig.apiServer,
        timeout: 5000,
        debug: false
    },

    callApi: function(apiPath, options, callback) {

        Utils.warn("callback", callback);

        var body = { data: JSON.stringify(body) };
        this.defaultOptions.body = body;
        _.merge(this.defaultOptions, options);

        this.defaultOptions.path = apiPath;

        var handleResponse = function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                // Utils.clog('HttpWrap>', 'res>', str);
                var blob = JSON.parse(str);
                options.response = blob;
                callback(options);
            });
        };

        var handleTimeout = function(err) {
            Utils.error("HttpWrap", "timeout", err);
        };

        // var request = http.request(options);
        // request.setTimeout(30000, onProblem);
        // request.on('error', onProblem);

        var request = http.request(this.defaultOptions, handleResponse);
        request.end();

        request.setTimeout(3000, handleTimeout);

    }

    // XgetApi1: function(apiPath, callback) {

    //     var endPoint = {
    //         host: AppConfig.apiServer,
    //         path: apiPath
    //     };

    //     console.log("getApi", endPoint);
    //     return http.get(endPoint, function(response) {
    //         // Continuously update stream with data
    //         var body = '';
    //         response.on('data', function(d) {
    //             body += d;
    //         });
    //         response.on('end', function() {

    //             // Data reception is done, do whatever with it!
    //             var parsed = JSON.parse(body);
    //             callback(parsed);
    //         });
    //     });

    // }

};

module.exports = HttpWrap;
