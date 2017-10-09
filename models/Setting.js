'use strict';

const   mongoose  = require('mongoose'),
        path            = require('path'),
        config          = require(require(path.resolve('./core/env')).getEnv),
        Schema          = mongoose.Schema,

settingSchema 	= new Schema({

    banner_img : {
        type : Array
    },
    video_url: {
        type: String
    },
    site: {
        address:{
            type:String
        },
        fax:{
            type:String
        },
        phone:{
            type:String
        },
        domain:{
            type:String
        }    
    }
       
}, { timestamps : { createdAt: 'created_at' ,  updatedAt: 'updated_at'}});

module.exports = mongoose.model('setting', settingSchema);
