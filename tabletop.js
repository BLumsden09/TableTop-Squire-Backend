var io;
var gameSocket;
var App;
var rooms = [];
var players  = [];
var roomLists = {};
exports.initGame = function(sio, socket, player){
    io = sio;
    gameSocket = socket;
    rooms.push('global');
    gameSocket.emit('connected', gameSocket.id);
    players.push({name: player.name, email: player.email, socket: gameSocket.id});
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('enterGlobalRoom', enterGlobalRoom);
    gameSocket.on('newGameCreated', onNewGameCreated);
    gameSocket.on('playerJoinedRoom', playerJoinedRoom);
    gameSocket.on('messageRoom', messageRoom);
    gameSocket.on('invitePlayerName', invitePlayerName);
    gameSocket.on('getPlayerData', getPlayerData);
    gameSocket.on('error', error );
};

function createNewGame(data){
    console.log(data);
    var socket = this;
    console.log("Hey I created a new game!");
    rooms.push(data.game);
    roomLists[data.game] = [];
    var player = {player: data.player};
    if(!isInArray(player, roomLists[data.game]))
        roomLists[data.game].push(player);
    socket.emit('roomData', {gameID: data.game, socketID: gameSocket.id});
    socket.join(data.game);
    console.log("Joined room");
}

function playerJoinGame(data){
    var room = io.sockets.adapter.rooms[data.gameID];
    var socket = this;
    //var room = gameSocket.sockets.manager.rooms["/" + data.gameID];
    if(room != undefined){
        socket.join(data.gameID).emit('joinedGame', {gameID: data.gameID, socketID: gameSocket.id, players: roomLists[data.gameID]});
        roomLists[data.gameID].push({player: data.player});
        socket.broadcast.to(data.gameID).emit('newPlayerJoinedGame', data.player);
    } else{
        this.emit('error', {message: "This room does not exist."});
    }
}


function enterGlobalRoom(data){
    console.log("Attempting to enter global room");
    App.Player.onJoinGlobal(data);
}

function onNewGameCreated(data){
        console.log("Initializing Game Data");
        App.DM.gameInit(data);
}

function playerJoinedRoom(data){
        App[App.myRole].updateWaitingScreen(data);
}

function invitePlayerName(data){
    var socket = this;
    var invitedSocket = null;
    players.forEach(function(player){
        if(player.name === data.name){
            invitedSocket = player.socket;
        }
    });
    if(invitedSocket != null)
        socket.broadcast.to(invitedSocket).emit("gameInvite", {gameID: data.gameID, playerName: data.playerName});
}

function getPlayerData(data){
    console.log(roomLists[data.gameID]);
    var socket = this;
    socket.emit("currentPlayers", roomLists[data.gameID]);
}

function messageRoom(data){
    console.log(data);
    var socket = this;
    var message = {playerName: data.playerName, message: data.message};
    //io.in(data.gameID).emit("message", message);
    console.log(io.sockets.adapter.rooms[data.gameID]);
    socket.broadcast.to(data.gameID).emit("message", message);
    //io.emit("message", message);
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function error(data){
        console.log("Error: " + data.message);
}

App = {
    gameID: 0,
    myRole: '',
    socketID: '',
    DM : {
        players: [],
        numPlayersInRoom: 0,
        gameInit: function(data){
            console.log("Before setting game data");
            App.gameID = data.gameID;
            App.socketID = data.socketID;
            App.myRole = 'DM';
            App.DM.numPlayersInRoom = 0;
            console.log("After setting game data");
            console.log(data);
            gameSocket.emit("roleData", {gameRole: App.myRole});
        },

        updateWaitingScreen: function(data) {
            console.log('Player ' + data.playerName + 'joined the game.');
            App.DM.players.push(data);
            App.DM.numPlayersInRoom += 1;
        }
    },

    Player : {
        gameID: '',
        socketID: '',
        myName: '',
        players: [],
        onJoinGlobal: function(data){
            App.myRole = 'Player';
            gameSocket.join('global');
        },

        updateWaitingScreen: function(data){
            if(socket.transport.id === data.socketID){
                App.myRole = 'Player';
                App.gameId = data.gameId;
                console.log('Joined Game ' + data.gameId + '. Please wait for game to begin.');
            }
        }

    }


};
