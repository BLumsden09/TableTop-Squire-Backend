var io;
var gameSocket;
var App;
var rooms = [];
var roomLists = {};
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    rooms.push('global');
    gameSocket.emit('connected', gameSocket.id);
    
    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('enterGlobalRoom', enterGlobalRoom);
    gameSocket.on('newGameCreated', onNewGameCreated);
    gameSocket.on('playerJoinedRoom', playerJoinedRoom);
    gameSocket.on('messageRoom', messageRoom);
    gameSocket.on('getPlayerData', getPlayerData);
    gameSocket.on('error', error );
};

function createNewGame(data){
    //var gameID = (Math.random()* 100000) | 0;
    console.log("Hey I created a new game!");
    rooms.push(data.game);
    roomLists[data.game] = [];
    roomLists[data.game].push({name: data.player, character: data.character});
    gameSocket.emit('roomData', {gameID: data.game, socketID: gameSocket.id});
    gameSocket.join(data.game);
    console.log("Joined room");
}

function playerJoinGame(data){
    var room = io.sockets.adapter.rooms[data.gameID];
    //var room = gameSocket.sockets.manager.rooms["/" + data.gameID];
    if(room != undefined){
        data.socketID = gameSocket.id;
        roomLists[data.gameID].push({name: data.playerName, character: data.characterName});
        data.players = roomLists[data.gameID];
        gameSocket.join(data.gameID).emit('playerJoinedRoom', data);
    } else{
        this.emit('error', {message: "This room does not exist."});
    }
}

function getPlayerData(data){
    console.log(roomLists[data.gameID]);
    gameSocket.emit("currentPlayers", roomLists[data.gameID]);
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

function messageRoom(data){
    console.log(data);
    var message = {playerName: data.playerName, message: data.message};
    //io.in(data.gameID).emit("message", message);
    console.log(io.sockets.adapter.rooms[data.gameID]);
    gameSocket.broadcast.to(data.gameID).emit("message", message);
    //io.emit("message", message);
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
