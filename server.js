// builtin modules
var http = require('http');
var url = require('url');

// external modules
var static = require('node-static');

// our modules
var config = require('./config');
var lib = require('./lib');
var rest = require('./rest');

// global objects
var fileServer = new static.Server(config.frontendDir);
var httpServer = http.createServer();

// handling HTTP requests
httpServer.on('request', function (req, rep) {

    var endpoint = url.parse(req.url, true).pathname;
    var query = url.parse(req.url, true).query;
    var payload = lib.getPayload(req, rep, function(rep, payload) {

        // create object name from endpoint url: /example/data => example.data
        var objName = endpoint.replace('/', ' ').trim().replace(' ', '.');

        if(rest[objName] && typeof rest[objName] == 'function') {
            try {
                console.log('XHR rest.' + objName, req.method, 'query=' + JSON.stringify(query), 'payload=' + JSON.stringify(payload));
                rest[objName](rep, req.method, query, payload);
            } catch(ex) {
                lib.sendError(rep, 500, 'Server error');
            }
        } else {
            console.log(req.method, endpoint);
            fileServer.serve(req, rep);
        }
    });

});

try {
    httpServer.listen(config.port);
    console.log("HTTP server is listening on the port " + config.port);
} catch(ex) {
    console.log("Port " + config.listeningPort + " cannot be used");
    process.exit(0);
}