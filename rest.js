var util = require('util');
var mongodb = require('mongodb');
var lib = require('./lib');
var common = require('./common');
var config = require('./config');

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
            case 'DELETE':
                try {
                    common.persons.findOne({ _id: mongodb.ObjectId(query._id) }, function(err, personDoc) {
                        if(!err && personDoc) {
                            common.persons.deleteOne({ _id: mongodb.ObjectId(query._id) }); // synchronicznie!
                            lib.sendJson(rep, personDoc);
                        } else {
                            lib.sendError(rep, 404, 'Not found');
                        }
                    });
                } catch(ex) {
                    lib.sendError(rep, 400, 'Invalid query');
                }
                break;
            default:
                sendError(rep, 400, 'Invalid method');
        }
    },

    'persons': function(rep, method, query, payload) {
        try {
            switch(method) {
                case 'GET':
                    var skip = parseInt(query.skip);
                    if(isNaN(skip) || skip < 0) skip = 0;
                    var limit = parseInt(query.limit);
                    if(isNaN(limit) || limit <= 0) limit = config.defaultLimit;
                    var select = {};
                    if(query.search) {
                        select = {
                            $or: [
                                { firstName: { $regex: new RegExp(query.search, 'i') }},
                                { lastName: { $regex: new RegExp(query.search, 'i') }}
                            ]
                        };
                    }
                    common.persons.find(select).skip(skip).limit(limit).toArray(function(err, personsArray) {
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