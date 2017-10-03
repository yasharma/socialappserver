'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./core/env')).getEnv),
        Schema          = mongoose.Schema,

settingSchema 	= new Schema({

    steps : {
        type : Object
    },
    how_it_works: {
        type: Object
    }
   
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('setting', settingSchema);
