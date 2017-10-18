'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	crypto      = require('crypto'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./core/lib/mail')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
	json2csv    = require('json2csv'),
    fs          = require('fs'),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.totalUsers = (req, res, next) => {
	User.count({role:{$ne:'admin'}},function (err, count) {
		if(err){
			return res.json({errors: error});
		}
		res.json({result: {count: count}});
	});
};
function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return (Math.floor(Math.random() * (max - min)) + min).toString(); 
  };
exports.add = (req, res, next) => { 

    req.body.password=crypto.createHash('md5').update(getRandomInt()).digest("hex");
    let user = new User(req.body);
       user.save(function(err, user) {
	        if(err)next(err);
	        else{
	      	mail.send({
				subject: 'New User Registration',
				html: './public/email_templates/user/signup.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    signupLink: `${config.server.host}:${config.server.PORT}/api/verify_email/${user.salt}`,
		   		    email: user.email
		   		}
			}, (err, success) => {
				if(err){
					next(err);
				} else {
					res.json({
			          responsedata:{
			            message:"user signup successfully",
			            user:user,
			            success:1
			          }    
	       	       })
				}
			});
	           
	        }
	  });
};

exports.edit = (req, res, next) => {
	if(!req.params.id) {
		res.status(422).json({
			errors: {
				message: 'id is required', 
				success: false,
			}	
		});
		return;
	}
    User.update({_id: req.params.id},{$set: req.body}, 
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
				message: 'id is required', 
				success: false,
			}	
		});
		return;
	}	 
    
    
    User.findOne({_id: req.params.id}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.list = (req, res, next) => {
	
	let operation = { role: "user" }, reqData = req.body,
	length = Number(reqData.length),
	start = Number(reqData.start);


	if( reqData.email ){
		operation.email = {$regex: new RegExp(`${reqData.email}`), $options:"im"};
	}
	if( reqData.mobile ){
		operation.mobile = {$regex: new RegExp(`${reqData.mobile}`), $options:"im"};
	}
	if( reqData.customer_name ){
		operation.customer_name = {$regex: new RegExp(`${reqData.customer_name}`), $options:"im"};
	}
	if( reqData.customer_url ){
		operation.customer_url = {$regex: new RegExp(`${reqData.customer_url}`), $options:"im"};
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
				User.remove({_id: {$in:_ids}},done);
			} 
            else if( reqData.customActionType === 'group_action' && reqData.customActionName === 'active') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				User.update({_id: {$in:_ids}},{$set:{status:true,email_verified:true}},{multi:true},done);
			}
			else if( reqData.customActionType === 'group_action' && reqData.customActionName === 'inactive') {
				let _ids = _.map(reqData.id, mongoose.Types.ObjectId);
				User.update({_id: {$in:_ids}},{$set:{status:false,email_verified:false}},{multi:true},done);
			}
			else {
				done(null, null);
			}
		},
		function (data, done) {
			async.parallel({
				count: (done) => {
					User.count(operation,done);
				},
				records: (done) => {
					User.find(operation,done).skip(start).limit(length);
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
		
		let dataTableObj = datatable.userTable(status_list, result.count, result.records, Number(reqData.draw));
		res.json(dataTableObj);
	});
};

exports.exportcsv = (req, res, next) => {
	var fields = ['customer_name', 'customer_url', 'business_name','mobile','email',
				  'name','price','description','type','website_url','start_date','expiration_date'];
	
	 	User.aggregate([
			   {
			      $match:{"role":"user" }
			   },
			   {
			      $unwind: "$subscription_plan"
			   },
			   {
			      $lookup:
			         {
			            from: "subscriptions",
			            localField: "subscription_plan.plan_id",
			            foreignField: "_id",
			            as: "subscription_docs"
			        }
			   },
			   {
			      $match: { "subscription_docs": { $ne: [] } }
			   },
			   {
			      $unwind: "$subscription_docs"
			   },
			   {
			   	  $project:{'customer_name':1,'customer_url':1,'website_url':1,'business_name':1,'mobile':1,'email':1,
			   	   			 'plan_id':'$subscription_plan.plan_id','website_url':'$subscription_plan.website_url',
			    	   		 'start_date':{ "$dateToString": { "format": "%Y-%m-%d", "date": '$subscription_plan.start_date' } },'expiration_date':{ "$dateToString": { "format": "%Y-%m-%d", "date": '$subscription_plan.expiration_date' } },'name':'$subscription_docs.name',
			   	   			 'price':'$subscription_docs.price','description':'$subscription_docs.description','type':'$subscription_docs.type'
			   				}
			   }

			],function(err,result){
				if(err){
					return next(err);
				}
			     var csv = json2csv({ data: result, fields: fields }),
		         filename="customercsv_"+new Date().getTime()+".csv"; 

				 fs.writeFile('./assets/customer_csv/'+filename, csv, function(err) {
			      if (err) throw err;
			      console.log('file saved');
			     });
				 res.json({result: {result:csv,success:true,filename:filename}});
			});
};