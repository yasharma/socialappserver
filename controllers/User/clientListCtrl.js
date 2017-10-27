'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	fs 			= require('fs'),
	csv 		= require('csvtojson'),
	json2csv    = require('json2csv'),
	async		= require('async'),
	mongoose	= require('mongoose'),
	_ 			= require('lodash'),
	paginate 	= require(path.resolve('./core/lib/paginate')),
	ClientList  = require(path.resolve('./models/ClientList')),
	User        = require(path.resolve('./models/User')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.importClientList = (req, res, next) => {

	const csvFilePath=req.files[0].path,jsonArr=[];
	let checkField=false;
   
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		if( jsonObj.hasOwnProperty("name")===true && jsonObj.hasOwnProperty("location")===true && 
			jsonObj.hasOwnProperty("plan")===true && jsonObj.hasOwnProperty("date")===true &&
			jsonObj.hasOwnProperty("image_url")===true)
		{
			jsonObj.user_id = req.body._id;
			jsonObj.subscription_id = req.body.subscription_id;
			jsonObj.action = req.body.action;
			jsonArr.push(jsonObj);
		}
		else{
			checkField=true;
		}
	})
	.on('done',(error)=>{
		if(checkField==true){
			return res.json(response.success({
					success: 0, 
					message: 'Please import csv with valid field name'
			}));
		}
		else{
	  		fs.unlinkSync(csvFilePath);
			ClientList.insertMany(jsonArr,function(err, importres) {
		     if(err){return next(err)}
		     else{
	       		res.json(response.success({
					success: true, 
					message: 'Client list imported successfully'
				}));
		      }
		    });
		}
	 })
};

exports.clientList = (req,res,next) => {
	let filter = {};
		filter.user_id= mongoose.Types.ObjectId( req.body._id);
		filter.subscription_id= mongoose.Types.ObjectId(req.body.subscription_id);
   	if( !req.body._id || !req.body.subscription_id ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id and Subscription Id are required'}));
      }
	if(req.body.location){
		filter.location=  {$regex: new RegExp(`${req.body.location}`), $options:"im"};
	}
	if(req.body.name){
		filter.name=  {$regex: new RegExp(`${req.body.name}`), $options:"im"};
	}
	if(req.body.plan){
		filter.plan=   {$regex: new RegExp(`${req.body.plan}`), $options:"im"};
	}
	if(req.body.date){
		filter.date=  {$eq: req.body.date};
	}
   	let page= req.query.page || 1;
	let _skip = (page - 1) * config.docLimit; 
    async.waterfall([
       function(done){
    		User.aggregate([
    		   {
			      $match:{"_id": mongoose.Types.ObjectId( req.body._id) }
			   },
			   {
			      $unwind: "$subscription_plan"
			   },
			   
     	       {
			   	  $match: { 'subscription_plan._id': mongoose.Types.ObjectId(req.body.subscription_id)} 
			   },
			   {
			      $lookup: {
			            from: "subscriptions",
			            localField: "subscription_plan.plan_id",
			            foreignField: "_id",
			            as: "subscription_docs"
			        }
			   },
			   { 
			   	 $match: { "subscription_docs": { $ne: [] } } 
			   },
			   {  $unwind: "$subscription_docs"},
			   {
			   	   $project:{
			   	   	    _id:0,
			   	   		website_url: '$subscription_plan.website_url',
			   	   		start_date: '$subscription_plan.start_date',
			   	   		expiration_date: '$subscription_plan.expiration_date',
			   	   		plan_name: '$subscription_docs.name',
			   	   		plan_price:'$subscription_docs.price'
			   		}
			   	}
    		],done)
    	}
    	,
    	function(result,done){
			 async.parallel({
				count: (done) => {
					ClientList.count(filter,done);
				},
				records: (done) => {
				    ClientList.find( filter,{__v:0,user_id:0},function (err, list) {
						if( err ) {
							return res.json(response.error(err));
						}
						done(null,list);
					}).sort({created_at:-1}).skip(_skip).limit(config.docLimit);
				}
			}, (err, listresult) => {
				if(err){
					return res.json({errors: err});
				}
				let _records = [];
				if( !_.isEmpty(listresult.records) ) {
					_records = listresult.records;
				}
				let count = (listresult.count.length) > 0 ? listresult.count: 0;
		        let paginateObj = paginate._paging(count, _records, page);
                let fnlres={subscription_details:result[0],client_list:listresult.records,paging:paginateObj};
                done(null,fnlres);
     		});	
       }

    ],function(err,result){
    	if(err) return next(err);
		res.json(response.success(result));
    })

};


exports.exportClientList = (req, res, next) => {
   	if( !req.body._id) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id is required'}));
    }
	var fields = ['name', 'location', 'plan','date','image_url','action'];
	
 	ClientList.find({user_id:req.body._id},function(err,result){
		if(err){
			return next(err);
		}
	     var csv = json2csv({ data: result, fields: fields }),
         filename="clientListCsv_"+new Date().getTime()+".csv"; 
		 fs.writeFile('./assets/export_client_csv/'+filename, csv, function(err) {
		      if (err) throw err;
		      console.log('file saved');
	     });
			res.json({result: {records:csv,success:true,filename:filename}});
	});
 }