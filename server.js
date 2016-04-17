var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var ejs = require('ejs');
var hbs = require('express-hbs');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var characterController = require('./controllers/characterSheet');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');

var router = express.Router();
var port = process.env.PORT || 3000;
//var io = require('socket.io').listen(http);
var tts = require('./tabletop');
var http = require('http').createServer(app);
var io = require("socket.io")(http);

mongoose.connect('mongodb://localhost:27017/tabletopsquire');

app.engine('hbs', hbs.express4({
    defaultLayout: __dirname + '/views/layouts/default.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'com.tabletopsquire.app',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());

app.use('/public', express.static('public'));

app.get('/', function(req, res){
    res.render('pages/home');
});

router.route('/characters')
    .post(authController.isAuthenticated, characterController.postCharacters)
    .get(authController.isAuthenticated, characterController.getCharacters);

router.route('/character/:character_id')
    .get(authController.isAuthenticated, characterController.getCharacter)
    .put(authController.isAuthenticated, characterController.putCharacter)
    .delete(authController.isAuthenticated, characterController.deleteCharacter);

router.route('/users')
    .post(userController.postUsers);

router.route('/user')
    .get(authController.isAuthenticated, userController.getUser)
    .put(authController.isAuthenticated, userController.putUser)
    .delete(authController.isAuthenticated, userController.deleteUser);    

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);

app.use('/api', router);

http.listen(port);
console.log("Server is listening on port " + port);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('join', function() {
        console.log("join?");
        tts.initGame(io, socket);
    });
});