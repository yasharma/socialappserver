'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Testimonial	= require(path.resolve('./models/Testimonial')),
	response 	= require(path.resolve('./core/lib/response')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

// Get active Testimonial list
exports.list = (req, res, next) => {

	Testimonial.find({status: true}, function (err, result) {
		if(err) {
			res.json(response.error(err));
		} 
		res.json(response.success({success: true, result: result}))
 	})
};