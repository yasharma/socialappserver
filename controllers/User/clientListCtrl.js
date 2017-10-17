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