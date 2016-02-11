(function($){
    'use strict';
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

        init: function(){
            App.cacheElements();
            App.showInitScreen();
            App.bindEvents();
        },

        cacheElements: function(){
            App.$doc = $(document);
            App.$gameArea = $('#gameArea');
            App.$templateIntroScreen = $('#intro-screen-template').html();
            App.$templateNewGame = $('#create-game-template').html();
            App.$templateJoinGame = $('#join-game-template').html();
            App.$hostGame = $('#host-game-template').html();
        },

        bindEvents: function () {
            App.$doc.on('click', '#btnCreateGame', App.DM.onCreateClick);

            App.$doc.on('click', '#btnJoinGame', App.Player.onJoinClick);
            App.$doc.on('click', '#btnStart',App.Player.onPlayerStartClick);
        },

        showInitScreen: function() {
            App.$gameArea.html(App.$templateIntroScreen);
        },

        DM : {
            players: [],
            numPlayersInRoom: 0,
            onCreateClick: function(){
                IO.socket.emit('createNewGame');
            },

            gameInit: function(data){
                App.gameID = data.gameID;
                App.socketID = data.socketID;
                App.myRole = 'DM';
                App.DM.numPlayersInRoom = 0;

                App.DM.displayNewGameScreen();
            },

            displayNewGameScreen: function(){
                App.$gameArea.html(App.$templateNewGame);
                $('gameURL').text(window.location.href);
                $('#spanNewGameCode').text(App.gameID);
            },

            updateWaitingScreen: function(data) {
                $('#playersWaiting')
                    .append('<p/>')
                    .text('Player ' + data.playerName + 'joined the game.');

                App.DM.players.push(data);
                App.DM.numPlayersInRoom += 1;
            }
        },

        Player : {
            socketID: '',
            myName: '',
            onJoinClick: function(){
                console.log('You have have clicked to join a game');
                App.$gameArea.html(App.$templateJoinGame);
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

                    $('#playerWaitingMessage')
                        .append('<p/>')
                        .text('Joined Game ' + data.gameId + '. Please wait for game to begin.');
                }
            }

        }


    };

        IO.init();
        App.init();
})(jQuery);