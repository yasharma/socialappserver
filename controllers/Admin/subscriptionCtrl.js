'use strict';
const path 	 	= require('path'),
	mongoose 	= require('mongoose'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	Subscription= require(path.resolve('./models/Subscription')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.add = (req, res, next) => {
	if(!req.body.name ) {
		res.status(422).json({
			errors: {
				message: 'Subscription Name  is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    let subscription = new Subscription(req.body);
    subscription.save()
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));
};

exports.edit = (req, res, next) => {
	if(!req.body._id) {
		res.status(422).json({
			errors: {
				message: 'id is required', 
				success: false,
			}	
		});
		return;
	}	 
 
    Subscription.update({_id: req.body._id},{$set: req.body}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true});
    	}
    );
};

exports.view = (req, res, next) => {
	if(!req.params.id) {
		res.status(422).json({
			errors: {
				message: 'Id is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    
    Subscription.findOne({_id: req.params.id}, 
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
	if( reqData.name ){
		operation.name = {$regex: new RegExp(`${reqData.name}`), $options:"im"};
	}
	if( reqData.description ){
		operation.description = {$regex: new RegExp(`${reqData.description}`), $options:"im"};
	}
	if( reqData.price ){
		operation.price = reqData.price;
	}
	if( reqData.features ){
		operation.features = {$regex: new RegExp(`${reqData.features}`), $options:"im"};
	}
	if( reqData.type ){
		operation.type = {$regex: new RegExp(`${reqData.type}`), $options:"im"};
	}
	if( reqData.status === "active" || reqData.status === "inactive" ){
		operation.status = reqData.status == "active" ? true : false;
	}
	if( reqData.from_date || reqData.to_date ) {
		operation.created_at = {$gte: reqData.from_date, $lte: reqData.to_date };
	}
	async.waterfall([
		function (done) {
			if( reqData.customActionType === 'group_action' && reqData.customActionName === 'remove') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				Subscription.remove({_id: {$in:_ids}},done);
			} 
			else if( reqData.customActionType === 'group_action' ) {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				let _status =  ( reqData.customActionName === 'inactive' ) ? false : true;
				Subscription.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					Subscription.count(operation,done);
				},
				records: (done) => {
					Subscription.find(operation,done);	
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
		
		let dataTableObj = datatable.subscriptionTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};