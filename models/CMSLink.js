'use strict';

const 
    mongoose        = require('mongoose'),
    path            = require('path'),
    slug            = require('mongoose-slug-generator'),
    config          = require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
    Schema          = mongoose.Schema,

CMSLinkSchema   = new Schema({
    title: {
        type: String,
    },
    url: {
        type: String,
    },
    slug: { 
        type: String, 
        slug: "title",
        unique:true 
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

mongoose.plugin(slug);
module.exports = mongoose.model('CMSLink', CMSLinkSchema);
