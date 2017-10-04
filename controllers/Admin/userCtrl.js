'use strict';
const path 	 	= require('path'),
	async 	 	= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	crypto      = require('crypto'),
	User 	 	= require(path.resolve('./models/User')),
	mail 	 	= require(path.resolve('./core/lib/mail')),
	datatable 	= require(path.resolve('./core/lib/datatable')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));


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
				html: './public/email_templates/user/register.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    url: `${config.server.host}:${config.server.PORT}/api/verify_email/${user.salt}`,
		   		    email: user.email
		   		 }
				}, (err, success) => {
					if(err){
					    console.log("error------mail sent"+err);
						reject(err);
					} else {
						console.log("success------mail sent"+success);
						resolve(success);
					}
				});
	            res.json({
		          responsedata:{
		            message:"user signup successfully",
		            user:user,
		            success:1
		           }    
	       	    })
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
	
	let operation = { role: "user" }, reqData = req.body;
	if( reqData.email ){
		operation.email = {$regex: new RegExp(`${reqData.email}`), $options:"im"};
	}
	if( reqData.mobile ){
		operation.mobile = {$regex: new RegExp(`${reqData.mobile}`), $options:"im"};
	}
	if( reqData.customer_name ){
		operation.customer_name = {$regex: new RegExp(`${reqData.customer_name}`), $options:"im"};
	}
	if( reqData.business_name ){
		operation.business_name = {$regex: new RegExp(`${reqData.business_name}`), $options:"im"};
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
					User.find(operation,done);	
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
		
		let dataTableObj = datatable.userTable(status_list, result.count, result.records, reqData.draw);
		res.json(dataTableObj);
	});
};