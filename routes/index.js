const express = require('express');
const router = express.Router();
const fs = require('fs');
const WebSocketServer = require('websocket').server;
var http = require('http');

let connections = [];

router.get('/', function(req, res, next) {
  res.render('static/index');
});

router.get('/interviewer', function(req, res, next) {
   res.render('interviewer', {id:2}); 
});

router.get('/interviewee', function(req, res, next) {
   res.render('interviewee', {id:1});
});

const server = http.createServer(function(request, response) {
    console.log((new Date()) + " Received request for " + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(6502, function() {
    console.log((new Date()) + " Server is listening on port 6502");
});
const wsServer = new WebSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 128000,
    autoAcceptConnections: true // You should use false here! -- Review notes on how this should work in production
});
wsServer.on('connect', function(connection) {
  console.log((new Date()) + " Connection accepted.");
  connections.push(connection);
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          //console.log("Received Message: " + message.utf8Data);
          // Process messages
          let msg = JSON.parse(message.utf8Data);
          connection.id = msg.id;
          switch(msg.type) {
            case 'streamingdata':
                for (peer of connections) {
                    if (peer.id !== connection.id) {
                        peer.sendUTF(JSON.stringify(msg));
                    }
                }
                return;
          }
      }
  });
  
  // Handle the WebSocket "close" event; this means a user has logged off or has been disconnected.
  connection.on('close', function(connection, closeReason, description) {
    console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    console.log(closeReason);
    console.log(description);
  });
});


module.exports = router;
