var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var port = 8080;

http.createServer(function(request, response) {
	
	var respond = function(error, data) {
		if(error) {
			response.writeHead(500);
			response.end();
		}
		else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(data);
		}
	}
	
	var readFile = function(fileExists) {
		if(fileExists)
			fs.readFile(filePath, respond);
		else {
			response.writeHead(404);
			response.end();
		}
	}
	
	var processPostRequest = function() {
		var body = '';
		request.on('data', function (data) {
			body += data;
		});
		
		request.on('end', function() {
			console.log(JSON.stringify(JSON.parse(body), null, 2));
		});
	}
	
	var getFilePath = function() {
		if(request.url == '/')
			return 'index.html';
		else return '.' + request.url;
	}
	
	var getContentType = function() {
		if(filePath.indexOf('.css') > -1)
			return 'text/css';
		else if(filePath.indexOf('.js') > -1)
			return 'text/css';
		else return 'text.html';
	}
	
	if(request.method == "POST")
		processPostRequest();
	
	var filePath = getFilePath();
	
	var contentType = getContentType();
	
	fs.exists(filePath, readFile);

}).listen(8080);
console.log("LISTENING");
