var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var tts = require('./tabletop.js');
var connect = require('connect');

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(8080, function(){
    console.log('Listening on port: 8080');
});

io.sockets.on('connection', function(socket){
    console.log('Hi');
    socket.on('join', function(data) {
        tts.initGame(io, socket);
    });
});

