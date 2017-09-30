'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	CMS 	 	= require(path.resolve('./models/Cms')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.add = (req, res, next) => {
	if(!req.body.title || !req.body.type) {
		res.status(422).json({
			errors: {
				message: 'Title and type is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    let cms = new CMS(req.body);
    cms.save()
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));
};

exports.edit = (req, res, next) => {
	if(!req.body._id) {
		res.status(422).json({
			errors: {
				message: 'Title and type is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    
    CMS.update({_id: req.body._id},{$set: { title: req.body.title, type: req.body.type, description: req.body.description }}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params.type) {
		res.status(422).json({
			errors: {
				message: 'Type is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    
    CMS.findOne({type: req.params.type}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	
	let operation = {}, reqData = req.body;
	if( reqData.title ){
		operation.title = {$regex: new RegExp(`${reqData.title}`), $options:"im"};
	}
	if( reqData.type ){
		operation.type = {$regex: new RegExp(`${reqData.type}`), $options:"im"};
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
					CMS.find(operation,done);	
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