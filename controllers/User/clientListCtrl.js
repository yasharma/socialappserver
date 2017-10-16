'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	async 		= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Subscription= require(path.resolve('./models/Subscription')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.importClientList = (req, res, next) => {
	console.log("body-------------"+req.body);
	console.log("files-----------"+req.body);
	next(null);
};