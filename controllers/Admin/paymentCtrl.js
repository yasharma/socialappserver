'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Payment 	= require(path.resolve('./models/Payment')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));


exports.paymentCount = (req, res, next) => {
	Payment.count({role:{$ne:'admin'}},function (err, count) {
		if(err){
			return res.json({errors: error});
		}
		res.json({result: {count: count}});
	});
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

	Payment.aggregate([
	    { $match : {_id: mongoose.Types.ObjectId(req.params.id)}},
	    {
	      $lookup: {
	            from: "users",
	            localField: "user_id",
	            foreignField: "_id",
	            as: "user_docs"
	        }
	    },
		{
	      $lookup: {
	            from: "subscriptions",
	            localField: "plan_id",
	            foreignField: "_id",
	            as: "subscription_docs"
	        }
	    },
	    { 
	    	$match: { "subscription_docs": { $ne: [] } } 
	    },
	    {
  			$unwind: "$user_docs"
			},
			{
  			$unwind: "$subscription_docs"
			},
	    {
	   	   $project:{
	   	   		_id: 1,
	   	   		payment_id:1,
	   	   		amount: 1,
	   	   		balance_transaction:1,
	   	   		description:1,
	   	   		created_at:1,
	   	   		status:1,
	   	   		customer_name:'$user_docs.customer_name',
	   	   		user_id:"$user_docs._id",
	   	   		email: '$user_docs.email',
	   	   		expiration_date: '$subscription_docs.expiration_date',
	   	   		plan_name: '$subscription_docs.name',
	   	   		plan_price:'$subscription_docs.price',
	   	   		plan_description:'$subscription_docs.description',
	   	   		plan_type:'$subscription_docs.type'
	   		}
	   	}
	],function (error, result) {
		if(error){
			res.json({errors: error});
		}
		res.json({success: true, result: result});
	});
};

exports.list = (req, res, next) => {

	let operation = {}, reqData = req.body,
		length = Number(reqData.length),
		start = Number(reqData.start);
	if( reqData.amount ){
		operation.amount = reqData.amount;
	}
	if( reqData.customer_name ){
		operation.customer_name = {$regex: new RegExp(`${reqData.customer_name}`), $options:"im"};
	}
	if( reqData.email ){
		operation.email = {$regex: new RegExp(`${reqData.email}`), $options:"im"};
	}
	if( reqData.plan_name ){
		operation.plan_name = {$regex: new RegExp(`${reqData.plan_name}`), $options:"im"};
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
					Payment.update({_id: {$in:_ids}},{$set:{status: _status}},{multi:true}, done);	
				} 	
				
			} else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					Payment.count(operation,done);
				},
				records: (done) => {
					Payment.aggregate([
					    {
					      $lookup: {
					            from: "users",
					            localField: "user_id",
					            foreignField: "_id",
					            as: "user_docs"
					        }
					    },
						{
					      $lookup: {
					            from: "subscriptions",
					            localField: "plan_id",
					            foreignField: "_id",
					            as: "subscription_docs"
					        }
					    },
					    { 
					    	$match: { "subscription_docs": { $ne: [] } } 
					    },
					    {
			      			$unwind: "$user_docs"
			  			},
			  			{
			      			$unwind: "$subscription_docs"
			  			},
					    {
					   	   $project:{
					   	   		_id: 1,
					   	   		payment_id:1,
					   	   		amount: 1,
					   	   		balance_transaction:1,
					   	   		description:1,
					   	   		status:1,
					   	   		customer_name:'$user_docs.customer_name',
					   	   		user_id:"$user_docs._id",
					   	   		email: '$user_docs.email',
					   	   		expiration_date: '$subscription_docs.expiration_date',
					   	   		plan_name: '$subscription_docs.name',
					   	   		plan_price:'$subscription_docs.price',
					   	   		plan_description:'$subscription_docs.description',
					   	   		plan_type:'$subscription_docs.type'
					   		}
					   	},
					   	{ $match : operation},
					   	{ $sort  : {created_at:-1} },
					   	{ $skip  : start },
					   	{ $limit : length }
					],done);
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
		let dataTableObj = datatable.paymentTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};