var config = require('./config');

var common = module.exports = {

    sessions: {},
    persons: null,

    initializeData: function(db) {
        common.persons = db.collection("persons");
        if(common.persons.countDocuments({}, function(err, n) {
            if(!err && n <= 0) {
                console.log("Initializing persons with example data");
                common.persons.insertMany(config.examplePersons);
            }
        }));    
    }

};