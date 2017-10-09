'use strict';

var 
    mongoose        = require('mongoose'),
    path            = require('path'),
    slug            = require('mongoose-slug-generator'),
    config          = require(path.resolve(`./core/env/${process.env.NODE_ENV}`));
    
var    Schema          = mongoose.Schema,

CMSSchema   = new Schema({
    banner_image:{
        name: {
            type: String
        },
        path: {
            type: String
        }
    },
    title: {
        type: String,
    },
    description: {
        type: String
    }, 
    url: {
        type: String
    },
    slug: { 
        type: String, 
        slug: "title",
        unique:true 
    },
    meta_title: {
        type: String
    },
    meta_description: {
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

mongoose.plugin(slug);
module.exports = mongoose.model('cms', CMSSchema, 'cms');
