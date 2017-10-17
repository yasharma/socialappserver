'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
crypto 			= require('crypto'),
config 			= require(require(path.resolve('./core/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

PaymentSchema   = new Schema({
    payment_id: {
        type: String,
    },
    amount: {
        type: Number,
    },
    balance_transaction: {
        type: String
    },
    customer: {
    	type: String
    },
    description: {
    	type: String
    },
    user_id: {
    	type: mongoose.Schema.Types.ObjectId
    }
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});


module.exports = mongoose.model('Payment', PaymentSchema);