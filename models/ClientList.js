'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

clientListSchema   = new Schema({
		name: {
			type: String
		},
		user_id:{
			type:String
		},
		subscription_id:{
			type:String
		},
		image_url:{
			type: String
	    },
		location: {
			type: String
		},
		plan: {
			type: String
		},
		date: {
			type: String
		},
		action:{
			type:String
		}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('clientlist', clientListSchema);
