'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	formidable 	= require('formidable'),
	CMS 		= require(path.resolve('./models/CMS')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.add = (req, res, next) => {
    // parse a file upload 
    var form = new formidable.IncomingForm();
    
    form.uploadDir = "./assets/cms_banner";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
    	if( err ) {
    		return res.json({errors: error});
    	}
    	if(!fields.title ) {
			return fields.status(422).json({
				errors: {
					message: 'Title  is required', 
					success: false,
				}	
			});
		}
		let banner_image = {};
		if( _.has(files, 'banner_image') ) {
			banner_image = {
				name: files.banner_image.name,
				path: files.banner_image.path
			}
			_.assign(fields, {banner_image: banner_image});
		}
		if( _.has(fields, '_id') ){
			edit(res, fields);
		} else {
			save(res, fields);
		}
    });
};

function save(res, body) {
	let cms = new CMS(body);
	cms.save()
	.then(result => res.json({success: true}))
	.catch(error => res.json({errors: error}));
}

function edit(res, body) {

	CMS.update({_id: body._id},{$set: body}, 
		function (error, result) {
			if(error){
				return res.json({errors: error});
			}
			res.json({success: true});
		}
	);
}

exports.edit = (req, res, next) => {
	if(!req.body.slug) {
		res.status(422).json({
			errors: {
				message: 'Slug is required', 
				success: false,
			}	
		});
		return;
	}	 
  let reqData=req.body;
    
    CMS.update({slug: req.body.slug},{$set: reqData}, 
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
    
    
    CMS.findOne({slug: req.params.slug}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	
	let operation = {}, reqData = req.body,
		length = Number(reqData.length),
		start = Number(reqData.start);
	if( reqData.title ){
		operation.title = {$regex: new RegExp(`${reqData.title}`), $options:"im"};
	}

	if( reqData.description ){
		operation.description = {$regex: new RegExp(`${reqData.description}`), $options:"im"};
	}
	if( reqData.meta_title ){
		operation.meta_title = {$regex: new RegExp(`${reqData.meta_title}`), $options:"im"};
	}
    if( reqData.meta_description ){
		operation.meta_description= {$regex: new RegExp(`${reqData.meta_description}`), $options:"im"};
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
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				CMS.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					CMS.count(operation,done);
				},
				records: (done) => {
					CMS.find(operation,done).skip(start).limit(length);	
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
		
		let dataTableObj = datatable.cmsTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};