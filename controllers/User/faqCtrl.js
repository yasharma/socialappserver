'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	FAQ 	 	= require(path.resolve('./models/FAQ')),
	response 	= require(path.resolve('./core/lib/response')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

// Get active blog list
exports.list = (req, res, next) => {

	FAQ.find({ status: true}, function (err, result) {
		if(err) {
			res.json(response.error(err));
		} 
		res.json(response.success({success: true, result: result}))
 	})
};