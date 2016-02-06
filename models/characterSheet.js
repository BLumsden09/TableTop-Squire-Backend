var mongoose = require('mongoose');

var CharacterSchema = new mongoose.Schema({
    userId: String,
    name: String,
    race: String,
    class: String,
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
    level: Number,
    experience: Number
});

module.exports = mongoose.model('Character', CharacterSchema);