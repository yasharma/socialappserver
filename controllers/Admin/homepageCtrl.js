'use strict';
const path 	 	= require('path'),
	mongoose 	= require('mongoose'),
	Setting 	= require(path.resolve('models/Setting')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.add = (req, res, next) => {
    let imgArr=[];
	if(req.files.length > 0){
	
	req.files.forEach((file) => {
		let image = {};
		image.name = file.filename;
		image.original_name = file.originalname;
		image.path = file.path;
		imgArr.push(image);
	});
	req.body.banner_img = imgArr;	
	} else {
		delete req.body.banner_img
	}
	req.body.site={
	  address:req.body.address,
	  phone:req.body.phone,
	  fax:req.body.fax,
	  domain:req.body.domain,	
	}
	req.body.simple_steps={
	  step1:req.body.step1,
	  step2:req.body.step2,
	  step3:req.body.step3
	}
    let setting = new Setting(req.body);
    setting.save()
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));

};

exports.view = (req, res, next) => {
   Setting.find({}, 
    	function (error, result) {
    		if(error){
    			res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};