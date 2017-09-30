'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Blog 	 	= require(path.resolve('./models/Blog')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.add = (req, res, next) => {
	if(!req.body.title || !req.body.type ) {
		res.status(422).json({
			errors: {
				message: 'Title, type is required', 
				success: false,
			}	
		});
		return;
	}
	let reqData = req.body;
	if(req.files.length > 0){
		let image = {};
		req.files.forEach((file) => {
			image.name = file.filename;
			image.original_name = file.originalname;
			image.path = file.path;
		});
		
		reqData.image = image;	
	} else {
		delete reqData.image
	}
	
	
	if( reqData._id ){
		edit(reqData, res, next);
	} else {
		let blog = new Blog(reqData);
		blog.save()
		.then(result => res.json({success: true}))
		.catch(error => res.json({errors: error}));	
	}
    
};

function edit (reqData, res, next)  {
	reqData.slug = Blog.generateSlug(reqData);
    Blog.update(
    	{_id: reqData._id},
    	{$set: reqData }, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params.slug) {
		res.status(422).json({
			errors: {
				message: 'Slug is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    Blog.aggregate([
    	{
    		$match: { slug: req.params.slug }
    	},
    	{
    		$project: {
    			short_description: 1,
    			description: 1,
    			title: 1,
    			slug: 1,
    			image: "$image.path",
    			created_at: 1,
    			updated_at: 1,
    			status: 1,
    			type: 1
    		}
    	}
    ], 
	function (error, result) {
		if(error){
			res.json({errors: error});
		}
		res.json({success: true, result: result[0]});
	});
};

exports.list = (req, res, next) => {
	
	let operation = {}, reqData = req.body;
	if( reqData.title ){
		operation.title = {$regex: new RegExp(`${reqData.title}`), $options:"im"};
	}
	if( reqData.type ){
		operation.type = {$regex: new RegExp(`${reqData.type}`), $options:"im"};
	}
	if( reqData.slug ){
		operation.slug = {$regex: new RegExp(`${reqData.slug}`), $options:"im"};
	}
	if( reqData.status === "true" || reqData.status === "false" ){
		operation.status = reqData.status == "true" ? true : false;
	}

	if( reqData.from_date || reqData.to_date ) {
		operation.created_at = {$gte: reqData.from_date, $lte: reqData.to_date };
	}
	
	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				
				if( reqData.customActionName === 'inactive' || reqData.customActionName === 'active' ){
					let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
					Blog.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);	
				} else if(reqData.customActionName === 'delete') {
					Blog.remove({_id: {$in:_ids}}, done);	
				}	
				
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					Blog.count(operation,done);
				},
				records: (done) => {
					Blog.find(operation,done);	
				}
			}, done);	
		}
	], (err, result) => {
		if(err){
			return res.json({errors: err});
		}
		let status_list = {
			class: {
				true : "info",
				false : "danger"	
			},
			status: {
				true : "Active",
				false : "InActive"	
			}
		};
		
		let dataTableObj = datatable.blogTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};