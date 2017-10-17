'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	async 		= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Subscription= require(path.resolve('./models/Subscription')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.planList = (req, res, next) => {
	let type = 'monthly';
	if( req.query.type ) {
		type = req.query.type
	}
	Subscription.find({status: true, type: type},{created_at:0,description:0,updated_at:0}, {sort: {order: 1}},function (err, list) {
		if( err ) {
			return res.json(response.error(err));
		}
		res.json(response.success(list));
	});
};