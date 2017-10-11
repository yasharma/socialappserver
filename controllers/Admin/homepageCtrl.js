'use strict';
const path 	 	= require('path'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	Setting 	= require(path.resolve('models/Setting')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`)),
  	paginate    = require(path.resolve('./core/lib/paginate'));

exports.edit = (req, res, next) => {
    let imgArr=[], oldFileArray=[];
	if(req.files.length > 0){
		req.files.forEach((file) => {
			let image = {};
			image.name = file.filename;
			image.original_name = file.originalname;
			image.path = file.path;
			imgArr.push(image);
		});

		if( !_.isEmpty(req.body.banner_img) && _.isArray(req.body.banner_img) ) {
			for( var i = 0; i< req.body.banner_img.length; i++  ){
			
				oldFileArray.push({
					path: req.body.banner_img[i]
				});
			}
			
			
			req.body.banner_img = _.concat(oldFileArray, imgArr);
		} else {
			req.body.banner_img = imgArr;	
		}
		
	} else {
		delete req.body.banner_img
	}

    Setting.update({_id:req.body._id},{$set:req.body})
    .then(result => res.json({success: true}))
    .catch(error => res.json({errors: error}));

};

exports.view = (req, res, next) => {
   Setting.findOne({}, 
    	function (error, result) {
    		if(error){
    			return res.json({errors: error});
    		}
    		res.json({success: true, result: result});
    	}
    );
};

exports.delete = (req, res, next) => {
	let buf = Buffer.from(req.params.path, 'base64'),
	path = buf.toString();
	Setting.update({}, {$pull:{"banner_img":{path:path}}}, function (err, success) {
		if(err){
			return res.json({errors: err});
		}
		res.json({success: true});
	});
};