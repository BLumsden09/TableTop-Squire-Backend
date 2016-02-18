var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var characterController = require('./controllers/characterSheet');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');

mongoose.connect('mongodb://localhost:27017/tabletopsquire');

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'com.tabletopsquire.app',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());

var router = express.Router();
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.render('home');
});

router.route('/characters')
    .post(authController.isAuthenticated, characterController.postCharacters)
    .get(authController.isAuthenticated, characterController.getCharacters);

router.route('/character/:character_id')
    .get(authController.isAuthenticated, characterController.getCharacter)
    .put(authController.isAuthenticated, characterController.putCharacter)
    .delete(authController.isAuthenticated, characterController.deleteCharacter);

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers);

router.route('/user')
    .get(authController.isAuthenticated, userController.getUser);

router.route('/user/:user_id')
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

app.listen(port);
console.log("Server is listening on port " + port);