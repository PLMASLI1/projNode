var util = require('util');
var mongodb = require('mongodb');
var lib = require('./lib');
var common = require('./common');

var rest = module.exports = {

    'person': function(rep, method, query, payload) {
        switch(method) {
            case 'GET':
                try {
                    common.persons.findOne({ _id: mongodb.ObjectId(query._id) }, function(err, personDoc) {
                        if(!err && personDoc) {
                            lib.sendJson(rep, personDoc);
                        } else {
                            lib.sendError(rep, 404, 'Not found');
                        }
                    });
                } catch(ex) {
                    lib.sendError(rep, 400, 'Invalid query');
                }
                break;
            case 'PUT':
                try {
                    var id = mongodb.ObjectId(payload._id);
                    delete payload._id;
                    common.persons.findOneAndUpdate({ _id: id },
                                                    { $set: payload },
                                                    { returnOriginal: false }, function(err, updated) {
                        if(!err) {
                            lib.sendJson(rep, updated.value);
                        } else {
                            lib.sendError(rep, 403, 'Update failed');
                        }
                    });
                } catch(ex) {
                    lib.sendError(rep, 400, 'Invalid query');
                }
                break;
            case 'POST':
                common.persons.insertOne(payload, function(err, inserted) {
                    if(!err) {
                        lib.sendJson(rep, inserted.ops[0]);
                    } else {
                        lib.sendError(rep, 400, 'Insert failed');
                    }
                });
                break;    
            default:
                sendError(rep, 400, 'Invalid method');
        }
    },

    persons: function(rep, method, query, payload) {
        try {
        switch(method) {
            case 'GET':
                common.persons.find().toArray(function(err, personsArray) {
                    if(!err) {
                        lib.sendJson(rep, personsArray);
                    } else {
                        lib.sendError(rep, 404, 'Not found');
                    }
                });
                break;
            default:
                lib.sendError(rep, 400, 'Invalid method');
        }
        } catch(ex) { console.error(ex); } 
    }

};