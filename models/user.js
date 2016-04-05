var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(callback){
    var user = this;
    console.log("Before isModified \n");

    if(!user.isModified('password')) return callback();

    console.log("After isModified \n");
    bcrypt.genSalt(5, function(err, salt){
        if(err) return callback(err);
        console.log("Before hash \n");
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if(err) return callback(err);

            user.password = hash;
            callback();
        });
    });
});


UserSchema.pre('remove', function(callback) {
    Sweepstakes.remove({userId: this._id}).exec();
    Submission.remove({userId: this._id}).exec();
    callback();
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);