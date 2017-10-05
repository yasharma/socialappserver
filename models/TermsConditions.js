'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    config          = require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
    Schema          = mongoose.Schema,

TermsCondSchema   = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('TermsConditions', TermsCondSchema, 'termsconditions');
