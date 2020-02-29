var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var config = {
    port: 8888
};

var sendErrorOnStaticContent = function (response, code) {
    console.log('>>> sending error ' + code + ' page');
    response.writeHead(code, {'Content-Type': 'text/plain; charset=utf-8'});
    switch (code) {
        case 404:
            response.write('Error 404: file not found.');
            break;
        case 403:
            response.write('Error 403: access denied.');
            break;
        case 406:
            response.write('Error 406: not acceptable');
            break;
        default:
            response.write('Error ' + code);
    }
    response.end();
}

var sendFile = function (response, filePath, fileContents) {
    var mimeType = mime.getType(path.basename(filePath));
    response.writeHead(200, {'Content-Type': mimeType });
    console.log('>>> sending file ' + filePath + ' ' + mimeType);
    response.end(fileContents);
}

var serveStaticContent = function (response, absPath) {
    var n = absPath.indexOf('?');
    var fileName = absPath.substring(0, n != -1 ? n : absPath.length);
    fs.exists(fileName, function (exists) {
        if (exists) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    sendErrorOnStaticContent(response, 406);
                } else {
                    sendFile(response, fileName, data);
                }
            });
        } else {
            if(fileName.endsWith('.map')) {
                console.log('>>> skipping request for ' + absPath);
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end('{}');
            } else {
                sendErrorOnStaticContent(response, 404);
            }
        }
    });
}

var konto = {
    firstName: "Mariusz",
    lastName: "Jarocki",
    balance: 500
};

var httpServer = http.createServer();

httpServer.on('request', function (req, rep) {

    console.log('<<< ' + req.method + ' ' + req.url);

	if(req.url == '/') {
		serveStaticContent(rep, 'html/index.html');
	} else if(req.url == '/favicon.ico') {
		serveStaticContent(rep, 'img/favicon.ico');
    } else if(/^\/(html|css|js|fonts|img)\//.test(req.url)) {
        serveStaticContent(rep, '.' + req.url);
    } else if(req.url == '/dane') {
        if(req.method == "POST") {
            var payload = "";
            req.on("data", function(data) {
                payload += data;
            }).on("end", function() {
                var retcode = 200;
                try {
                    var dane = JSON.parse(payload);
                    konto.balance = dane.x;
                } catch(ex) {
                    retcode = 400;
                }
                rep.writeHead(retcode, "OK", { contentType: "application/json" });
                rep.write(JSON.stringify(konto));
                konto.balance++;
                rep.end();
            });
        } else {
            rep.writeHead(200, "OK", { contentType: "application/json" });
            rep.write(JSON.stringify(konto));
            konto.balance++;
            rep.end();
        }
    } else {   
	    sendErrorOnStaticContent(rep, 403);
    }
});

try {
    httpServer.listen(config.port);
    console.log("HTTP server is listening on the port " + config.port);
} catch(ex) {
    console.log("Port " + config.listeningPort + " cannot be used");
    process.exit();
}