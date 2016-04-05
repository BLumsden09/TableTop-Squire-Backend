var io;
var gameSocket;
var App;

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', gameSocket.id);

    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('newGameCreated', onNewGameCreated);
    gameSocket.on('playerJoinedRoom', playerJoinedRoom);
    gameSocket.on('error', error );
};

function createNewGame(){
    var gameID = (Math.random()* 100000) | 0;
    console.log("Hey I created a new game!");
    gameSocket.emit('roomData', {gameID: gameID, socketID: gameSocket.id});
    gameSocket.join(gameID.toString());
    console.log("Joined room");
}

function playerJoinGame(data){
    var sock = this;
    var room = gameSocket.sockets.manager.rooms["/" + data.gameID];

    if(room != undefined){
        data.socketID = sock.id;
        sock.join(data.gameID).emit('playerJoinedRoom', data);
    } else{
        this.emit('error', {message: "This room does not exist."});
    }
}

function onNewGameCreated(data){
        console.log("Initializing Game Data");
        App.DM.gameInit(data);
}

function playerJoinedRoom(data){
        App[App.myRole].updateWaitingScreen(data);
}

function error(data){
        alert(data.message);
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
        socketID: '',
        myName: '',
        players: [],
        onJoinClick: function(){
            console.log('You have have clicked to join a game');
        },

        onPlayerStartClick: function(){
            var data = {
                gameID: +($('#inputGameId').val()),
                playerName: $('#inputPlayerName').val()
            };

            this.emit('playerJoinGame', data);
            App.myRole = 'Player';
            App.Player.myName = data.playerName;
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
