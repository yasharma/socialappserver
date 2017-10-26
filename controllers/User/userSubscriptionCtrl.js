'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User')),
	Subscription= require(path.resolve('./models/Subscription')),
	async 		= require('async'),
	paginate 	= require(path.resolve('./core/lib/paginate')),
	crypto 		= require('crypto'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));


exports.addWebsite = (req, res, next) => {
	if(!req.body.user_id && !req.body.plan_id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id is required'}));
	}
	let curDate=new Date();
	req.body.start_date=new Date();

	async.waterfall([
		function(done){
           Subscription.findOne({_id:req.body.plan_id},function(err,subscriptionresult){
           	  if(err){
					done(err, null);
				} else {
					
					if(subscriptionresult.type==="monthly"){
					  req.body.duration=30;	
					  req.body.expiration_date=curDate.setDate(curDate.getDate() + 30);
					}
					else{
				      req.body.duration=365;	
					  req.body.expiration_date=curDate.setDate(curDate.getDate() + 365);
					}
					done(null,req.body);
				}
           })
		},
		function(result,done){
		   	User.update({_id:req.body.user_id},{ $push: { subscription_plan: req.body } },done);
		}
	],function(err,result){
		if(err){
			next(err, null);
		} else {
			res.json(
			   response.success({
				 success: true,
			     message: 'website added successfully.'
			   })	
			);
		}
	});

};

exports.websiteList=(req, res, next) => {

	let page   = req.query.page || 1;
	let _skip  = (page - 1) * config.docLimit; 
	let filter = {};
	if(!req.body._id){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id is required'}));
	}
	if(req.body.website_url){
		filter.website_url=  {$regex: new RegExp(`${req.body.website_url}`), $options:"im"};
	}
	if(req.body.name){
		filter.name=  {$regex: new RegExp(`${req.body.name}`), $options:"im"};
	}
	if(req.body.price){
		filter.price=  req.body.price;
	}
	if(req.body.expiration_date){
		filter.expiration_date=  {$eq: req.body.expiration_date};
	}


	async.parallel({
		count: (done) => {
			User.aggregate([
		      {$match:{"_id": mongoose.Types.ObjectId( req.body._id) }},
		      {
		      	$project: {
		      		_id:0,
		           count: { $size: "$subscription_plan" }
		         }
		      }
		   ],done);
		},
		records: (done) => {
			User.aggregate([
			   {
			      $match:{"_id": mongoose.Types.ObjectId( req.body._id) }
			   },
			   {
			      $unwind: "$subscription_plan"
			   },
			   {
			      $lookup: {
			            from: "subscriptions",
			            localField: "subscription_plan.plan_id",
			            foreignField: "_id",
			            as: "subscription_docs"
			        }
			   },
			   {$match: { "subscription_docs": { $ne: [] } } },
			   {$unwind: "$subscription_docs"},
			   {
			   	   $project:{
			   	   		_id: '$subscription_plan._id',
			   	   		plan_id: '$subscription_plan.plan_id',
			   	   		website_url: '$subscription_plan.website_url',
			   	   		start_date: '$subscription_plan.start_date',
			   	   		expiration_date: '$subscription_plan.expiration_date',
			   	   		name: '$subscription_docs.name',
			   	   		price:'$subscription_docs.price',
			   	   		description:'$subscription_docs.description',
			   	   		type:'$subscription_docs.type'
			   		}
			   	},
			   	{
			   		$match:filter
			   	},
			   	{$sort : {'expiration_date':1} },
			   	{$skip  : _skip },
			   	{$limit : config.docLimit }
			],done);
		}
	}, (err, result) => {
		if(err){
			return res.json({errors: err});
		}
		let _records = [];
		if( !_.isEmpty(result.records) ) {
			_records = result.records;
		}
		let count = (result.count.length) > 0 ? result.count[0].count: 0;

        let paginateObj = paginate._paging(count, _records, page);
		res.json({
			records:_records,
			paging: paginateObj
		});
		
	});	

};



