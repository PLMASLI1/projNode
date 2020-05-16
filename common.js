var config = require('./config');

var common = module.exports = {

    sessions: {},
    login: null,
    role: 0,

    users: null,
    persons: null,

    initializeData: function(db) {
        
        common.users = db.collection("users");
        if(common.users.countDocuments({}, function(err, n) {
            if(!err && n <= 0) {
                console.log("Initializing users with example data");
                common.users.insertMany(config.exampleUsers);
            }
        }));

        common.persons = db.collection("persons");
        if(common.persons.countDocuments({}, function(err, n) {
            if(!err && n <= 0) {
                console.log("Initializing persons with example data");
                common.persons.insertMany(config.examplePersons);
            }
        }));

    }

};