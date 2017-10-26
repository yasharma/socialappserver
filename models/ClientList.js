'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

clientListSchema   = new Schema({
		name: {
			type: String
		},
		user_id:{
			type: mongoose.Schema.Types.ObjectId
		},
		subscription_id:{
<<<<<<< HEAD
			type:mongoose.Schema.Types.ObjectId
=======
			type: mongoose.Schema.Types.ObjectId
>>>>>>> 28246263a1a2eca115bcb853e6ac6e107e96ce52
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
