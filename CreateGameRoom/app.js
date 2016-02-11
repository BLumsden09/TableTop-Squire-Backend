var io = require('socket.io').listen(server);
var express = require('express');
var app = express();
var IO = {
    init: function(){
        IO.socket = io.connect();
        IO.bindEvents();
    },

    bindEvents: function(){
        IO.socket.on('connected', IO.onConnected);
        IO.socket.on('newGameCreated', IO.onNewGameCreated);
        IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
        IO.socket.on('error', IO.error );
    },

    onConnected: function(){
        app.socketID = IO.socket.socket.sessionid;
    },

    onNewGameCreated: function(data){
        app.host.gameInit(data);
    },

    playerJoinedRoom: function(data){
        app.emit("player joined room");
    }
}