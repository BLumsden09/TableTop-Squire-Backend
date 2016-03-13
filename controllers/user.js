var User = require('../models/user');

exports.postUsers = function(req, res) {
    var user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    user.save(function(err){
        if(err)
            res.send(err);

        res.json({ message: 'New user added to TableTop Squire!' });
    });
};

exports.getUser = function(req, res){
    User.findOne({ _id: req.user._id }, function(err, user){
        if(err)
            res.send(err);

        res.json(user);
    });
};

exports.putUser = function(req, res) {
    User.findOne({ _id: req.user._id }, function(err, user){
        if(err)
            res.send(err);
        user.email = req.body.email;
        user.password = req.body.password;
        user.save(function(err){
            if(err)
                res.send(err);

            res.json({ message: 'User updated!' });
        });
    });
};

exports.deleteUser = function(req, res){

    User.remove({ _id: req.params.user_id }, function(err){
        if(err)
            res.send(err);

        res.json({ message: 'User deleted!' });
    });
};