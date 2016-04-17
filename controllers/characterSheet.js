var Character = require('../models/characterSheet');

exports.postCharacters = function(req, res) {
    var character = new Character();

    character.userId = req.user._id;
    character.name = req.body.name;
    character.race = req.body.race;
    character.class = req.body.class;
    character.strength = req.body.strength;
    character.dexterity = req.body.dexterity;
    character.constitution = req.body.constitution;
    character.intelligence = req.body.intelligence;
    character.wisdom = req.body.wisdom;
    character.charisma = req.body.charisma;
    character.level = req.body.level;
    character.experience = req.body.experience;

    character.save(function(err){
        if(err)
            res.send(err);

        res.json({ message: 'Character added to the roster!', data: character});
    });
};

exports.getCharacters = function(req, res) {
    console.log("getCharacters enter\n");
    Character.find({ userId: req.user._id }, function(err, characters){
        if(err)
            res.send(err);

        res.json(characters);
    });
};

exports.getCharacter = function(req, res) {

    Character.find({ userId: req.user._id, _id: req.params.character_id }, function(err, character){
        if(err)
            res.send(err);

        res.json(character);
    });
};

exports.putCharacter = function(req, res) {

    Character.update({ userId: req.user._id, _id: req.params.character_id },
        {
            name: req.body.name,
            race: req.body.race,
            class: req.body.class,
            strength: req.body.strength,
            dexterity: req.body.dexterity,
            constitution: req.body.constitution,
            intelligence: req.body.intelligence,
            wisdom: req.body.wisdom,
            charisma: req.body.charisma,
            level: req.body.level,
            experience: req.body.experience
        },
        function(err){
            if(err)
                res.send(err);

            res.json({ message: 'Character updated' });
        }
    );
};

exports.deleteCharacter = function(req, res){

    Character.remove({ userId: req.user._id, _id: req.params.character_id }, function(err){
        if(err)
            res.send(err);

        res.json({ message: 'Character removed from the roster!' });
    });
};