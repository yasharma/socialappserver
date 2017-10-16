'use strict';

const mongoose 	= require('mongoose'),
Schema 			= mongoose.Schema,

clientListSchema   = new Schema({
		name: {
			type: String
		},
		image:{
			name: {
				type: String,
			},
			path: {
				type: String,
			},
			original_name:  {
				type: String,
			}
	    },
		location: {
			type: String
		},
		plan: {
			type: String
		},
		time: {
			type: String
		}
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('clientlist', clientListSchema);
