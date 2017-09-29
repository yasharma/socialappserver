'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Blog 	 	= require(path.resolve('./models/Blog')),
	response 	= require(path.resolve('./core/lib/response')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

// Get active blog list
exports.list = (req, res, next) => {
	if( !req.params.type ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Type is required'}));
	}

	Blog.find({type: req.params.type, status: true}, function (err, result) {
		if(err) {
			res.json(response.error(err));
		} 
		res.json(response.success({success: true, result: result}))
 	})
};