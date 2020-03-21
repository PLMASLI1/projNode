var lib = require('./lib');

var person = {
    firstName: 'Mariusz',
    lastName: 'Jarocki',
    email: 'mariusz.jarocki@wmii.uni.lodz.pl',
    yearofbirth: 1969
};

var rest = module.exports = {

    'person': function(rep, method, query, payload) {
        switch(method) {
            case 'GET':
                lib.sendJson(rep, person);
                break;
            case 'POST':
                person = payload;
                lib.sendJson(rep, person);
                break;
            default:
                sendError(rep, 400, 'Invalid method');
        }
    }

};