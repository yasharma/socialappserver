'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	fs 			= require('fs'),
	csv 		= require('csvtojson'),
	ClientList  = require(path.resolve('./models/ClientList')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.importClientList = (req, res, next) => {

	const csvFilePath=req.files[0].path,jsonArr=[];
   
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		jsonObj.user_id="59d62896b93fbb37f6b0d270";
		jsonObj.subscription_id="270";
		jsonObj.action="signed up";
		jsonArr.push(jsonObj);
	})
	.on('done',(error)=>{
		//fs.unlinkSync(csvFilePath);
		ClientList.insertMany(jsonArr,function(err, importres) {
	     if(err){next(err)}
	     else{
	       res.json({
	          responsedata:{
	             message:"Client list imported successfully",
	             name:"success",
	             success:1
	            }
	         });
	      }
	    });
	 })
};

exports.clientList = (req,res,next) => {
   	if( !req.body._id) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				  .json(response.required({message: 'Id is required'}));
      }
	ClientList.find({user_id:req.body._id},{__v:0,user_id:0},function (err, list) {
		if( err ) {
			return res.json(response.error(err));
		}
		res.json(response.success(list));
	});
};