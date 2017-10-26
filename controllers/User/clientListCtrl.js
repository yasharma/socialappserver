'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	fs 			= require('fs'),
	csv 		= require('csvtojson'),
	json2csv    = require('json2csv'),
	async		= require('async'),
	mongoose	= require('mongoose'),
	ClientList  = require(path.resolve('./models/ClientList')),
	User        = require(path.resolve('./models/User')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.importClientList = (req, res, next) => {

	const csvFilePath=req.files[0].path,jsonArr=[];
   
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		jsonObj.user_id = req.body._id;
		jsonObj.subscription_id = req.body.subscription_id;
		jsonObj.action = req.body.action;
		jsonArr.push(jsonObj);
	})
	.on('done',(error)=>{
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
	 })
};

exports.clientList = (req,res,next) => {
   	if( !req.body._id || !req.body.subscription_id ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id and Subscription Id are required'}));
      }

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
			   	   		pla_name: '$subscription_docs.name',
			   	   		plan_price:'$subscription_docs.price'
			   		}
			   	}
    		],done)
    	}
    	,
    	function(result,done){
		    ClientList.find({subscription_id:mongoose.Types.ObjectId(req.body.subscription_id),user_id:req.body._id},{__v:0,user_id:0},function (err, list) {
				if( err ) {
					return res.json(response.error(err));
				}
				let fnlres={subscription_details:result[0],client_list:list};
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