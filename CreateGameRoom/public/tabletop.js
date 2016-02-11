var io;
var gameSocket;

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!"});

    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('playerJoinGame', playerJoinGame);

    console.log(gameSocket);
}

function createNewGame(){
    var gameID = (Math.random()* 100000) | 0;
    this.emit('gameCreated', {gameID: gameID, socketID: this.id});
    this.join(gameID.toString());
};

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

