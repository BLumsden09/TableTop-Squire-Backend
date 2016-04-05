    /*var IO = {
        init: function(){
            var io = require('socket.io');
            IO.socket = io.connect();
            console.log("Before I bind socket events");
            IO.bindEvents();
        },

        bindEvents: function(){
            IO.socket.on('connected', IO.onConnected);
            IO.socket.on('newGameCreated', IO.onNewGameCreated);
            IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
            IO.socket.on('error', IO.error );
            console.log("After I bind socket events");
        },

        onConnected: function(){
            App.socketID = IO.socket.transport.id;
        },

        onNewGameCreated: function(data){
            App.DM.gameInit(data);
        },

        playerJoinedRoom: function(data){
            App[App.myRole].updateWaitingScreen(data);
        },

        error: function(data){
            alert(data.message);
        }
    };

    var App = {
        gameID: 0,
        myRole: '',
        socketID: '',
        DM : {
            players: [],
            numPlayersInRoom: 0,
            gameInit: function(data){
                App.gameID = data.gameID;
                App.socketID = data.socketID;
                App.myRole = 'DM';
                App.DM.numPlayersInRoom = 0;
                console.log(data);
                console.log(App.myRole);
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

                IO.socket.emit('playerJoinGame', data);
                App.myRole = 'Player';
                App.Player.myName = data.playerName;
            },

            updateWaitingScreen: function(data){
                if(IO.socket.transport.id === data.socketID){
                    App.myRole = 'Player';
                    App.gameId = data.gameId;
                    console.log('Joined Game ' + data.gameId + '. Please wait for game to begin.');
                }
            }

        }


    };

    IO.init();
    App.init();
*/