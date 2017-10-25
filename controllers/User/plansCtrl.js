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
	let query = {status: true},
	sort = {type: 1};
	
	if( req.query.type !== 'all') {
		_.assign(query, {type: req.query.type});
		sort = {order: 1};
	}
	Subscription.find(query,{created_at:0,description:0,updated_at:0}, {sort: sort},function (err, list) {
		if( err ) {
			return res.json(response.error(err));
		}
		res.json(response.success(list));
	});
};