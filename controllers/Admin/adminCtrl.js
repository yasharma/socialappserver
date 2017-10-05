'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User')),
	Setting 	= require(path.resolve('models/Setting')),
	_ 			= require('lodash'),
	jwt 	 	= require('jsonwebtoken'),
	async		= require('async'),
	mail 	 	= require(path.resolve('./core/lib/mail')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.register = (req, res, next) => {
	User.count({email: config.defaultAdmin.email}, (err, count) => {
		if(err){
			return console.log(err);
		}
		
		if(count === 0){
			let user = new User(config.defaultAdmin);
			user.save()
			.then(user => console.log('New Admin created') )
			.catch(err => console.log(err));
		}	
	});	
};

exports.login = (req, res, next) => {
	if( !req.body.email || !req.body.password ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Password is required'}));
	}
	
	User.findOne({ email: req.body.email }, {reset_password: 0, salt: 0},(err, user, next) => {
		if(err){
			res
			.json(response.error(err));
		} else {
			let errors = {}, error = false;
			switch(_.isNull(user) || !_.isNull(user)){
				// 1. IF User Not Found in Database
				case _.isNull(user):
					errors = { message: 'Authentication failed. User not found.'};
					error = true;
					break;

				// 3. IF Admin has Deactivate User Account
				case (!user.status):
					errors = { message: 'Your account is deactivated by admin, please contact admin.'};
					error = true;
					break;

				default: 
					error = false;
			}
			
			if(error){
				res
				.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.error(errors))
			} else {
				if(user.comparePassword(config.salt, req.body.password)){
					// Remove sensitive data before sending user object
					user.password = undefined;
					let token = jwt.sign(user, new Buffer(config.secret).toString('base64'), {expiresIn: '1 day'});
					res.json({user: user, token});
				} else {
					res
					.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
					.json(response.error({message: 'Authentication failed! Wrong Password'}));
				}
			}
		}
	});
};

exports.forgotpassword= (req,res,next) => {

 if(!req.body.email) {
	    return res.json({responsedata: {
	        message: 'Email is required', 
	        name: 'Authentication failed', 
	        success: 0} 
	      });
	  }
  let email = req.body.email,
  tmpEmail = _.escapeRegExp(req.body.email);

  async.waterfall([
    function (done) {
      User.findOne({ email: {$regex: new RegExp(`^${tmpEmail}`), $options:"im"}}, function (err, user) {
        if( err ){
          done(err, null);
        } else {
          let responsedata = null, error = false;
          switch(_.isNull(user) || !_.isNull(user)){
            case _.isNull(user):
              responsedata = {name:'Authentication failed', message:'Sorry! We weren\'t able to identify your email',success:0};
              error = true;
              break;
              
              default: 
              error = false;  
          }
          done(responsedata, user);
        }
      });
    },
    function (user, done) {
      
		mail.send({
			subject: 'Social-Proof Forgot Password',
			html: './public/email_templates/admin/forgot_password.html',
			from: config.mail.from, 
			to: user.email,
			emailData : {
				name    : user.customer_name,
	   		    username: user.email,
	   		    password: user.password
	   		}
		}, (err, success) => {
			if(err){
				done(err);
			} else {
				res.json({
					success: true, 
					message: 'Email has been sent on your email address with username and password'
				});
			}
		});
    }
  ], function (err, result) {
    if(err){
      return res.json({responsedata:{name:"error",status:0,message:err.message}});
    }
      return res.json({responsedata:{name:"success",status:1,message:result}});
  });

}


exports.setting = (req, res, next) => {

	let setting = new Setting(req.body);
		setting.save()
		.then(user => console.log('New Setting created') )
		.catch(err => console.log(err));
};