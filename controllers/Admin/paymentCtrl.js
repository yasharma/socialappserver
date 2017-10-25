'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Payment 	= require(path.resolve('./models/Payment')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));


exports.list = (req, res, next) => {
	console.log("in payment list---");
	let operation = {}, reqData = req.body,
		length = Number(reqData.length),
		start = Number(reqData.start);
	if( reqData.amount ){
		operation.amount = {$regex: new RegExp(`${reqData.amount}`), $options:"im"};
	}
	if( reqData.balance_transaction ){
		operation.balance_transaction = {$regex: new RegExp(`${reqData.balance_transaction}`), $options:"im"};
	}
	if( reqData.customer ){
		operation.customer = {$regex: new RegExp(`${reqData.customer}`), $options:"im"};
	}
	if( reqData.description ){
		operation.description = {$regex: new RegExp(`${reqData.description}`), $options:"im"};
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
				} else if(reqData.customActionName === 'delete') {
					Payment.remove({_id: {$in:_ids}}, done);	
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