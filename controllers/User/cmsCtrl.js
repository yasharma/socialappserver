'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	CMS 		= require(path.resolve('models/CMS')),
	async 		= require('async'),
	_ 			= require('lodash'),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.getCmsLinks = (req, res, next) => {
	CMS.find({status: true},{title: 1, slug: 1, url: 1},(err, links) => {
		if(err) {
			return res.json( response.error( err ) );
		}
		return res.json(response.success(links))
	});
};

exports.getCMS = (req, res, next) => {
	console.log(req.params.slug);
	CMS.findOne({slug: req.params.slug, status: true}, function (err, CMS) {
		if(err)	{
			return res.json( response.error( err ) );	
		}
		return res.json(response.success(CMS));
	});
}