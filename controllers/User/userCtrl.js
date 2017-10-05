'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User')),
	async 		= require('async'),
	crypto 		= require('crypto'),
	_ 			= require('lodash'),
	jwt 	 	= require('jsonwebtoken'),
	mail 	 	= require(path.resolve('./core/lib/mail')),
	twilio	 	= require(path.resolve('./core/lib/twilio')),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.register = (req, res, next) => {
	if( !req.body.email || !req.body.password || !req.body.mobile ){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email Password and Mobile is required'}));
	}
	
	async.waterfall([
		function (done) {
			twilio.isValidNumber(req.body.mobile)
			.then(response => done(null, response))
			.catch(err => done({errors:{mobile:{message:'Enter a valid Mobile Number'}}}));
		},
		function (isValid, done) {
			_.assign(req.body, {ip: req.ip});
			let user = new User(req.body);
			user.save(function (err, user) {
				if(err){
					done(err, null);
				} else {
					done(null, user);
				}
			});
		},
		function (user, done) {
			let baseUrl = `${req.protocol}://${req.headers.host}`;
			mail.send({
				subject: 'New User Registration',
				html: './public/email_templates/user/signup.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    signupLink: `${baseUrl}/api/verify_email/${user.salt}`,
		   		    email: user.email
		   		}
			}, (err, success) => {
				if(err){
					done(err);
				} else {
					res.json(response.success({
						success: true, 
						message: 'An account verification email has been sent on your email address, make sure to check inbox/spam folder'
					}));
				}
			});
		}
	], function (err) {
		User.remove({email: req.body.email});
		res
		.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
		.json(response.error(err.errors || err));
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

				// 2. IF User Email is not verified
				case (!user.email_verified):
					errors = { message: 'Kindly check your inbox/spam folder and verify your email'};
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
					res.json(response.success({success: true, user: user, token}));
				} else {
					res
					.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
					.json(response.error({message: 'Authentication failed! Wrong Password'}));
				}
			}
		}
	});
};


exports.verifyEmail = (req, res, next) => {
	User.findOneAndUpdate(
		{ "salt": req.params.salt, "email_verified": false },
		{ "email_verified": true, "salt": null, "status": true },
		{ new: true, runValidators: true, setDefaultsOnInsert: true, fields: {email: 1} },
		function(err, user){
    		if(err || !user){
    			if( process.env.NODE_ENV === 'development' ){
    				res.redirect(`${config.server.host}/?emailVerified=false`);	
    			} else {
    				res.redirect(`${config.server.host}/?emailVerified=false`);
    			}
    			
    		} else {
				res.redirect(`${config.server.host}/?emailVerified=true`);
    		}
    	}
    );
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {

	if( (!req.body.email || !req.body.mobile ) && !req.body.type){
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
			.json(response.required({message: 'Email or mobile number is required'}));
	}
	if( req.body.type === 'email' && req.body.email ) {
		forgotByEmail(req, res, next);
	} else if(req.body.type === 'mobile' && req.body.mobile) {
		forgotByMobile(req, res, next);
	} else {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
			.json(response.required({message: 'Email or mobile number is required'}));
	}
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res, next) => {
	User.count({ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true } , function(err, user){
    	if(user === 0){
    		if(process.env.NODE_ENV === 'test'){
    			return res.sendStatus(400);
    		}
    		return res.redirect('/invalid');
    	} else {
	    	if(process.env.NODE_ENV === 'test'){
				return res.sendStatus(200);
			}
			res.redirect(`${config.server.host}/reset-password/${req.params.token}`);	
    	}
    });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {

	async.waterfall([
		function(done){
			User.findOne(
				{ "reset_password.token": req.params.token, "reset_password.timestamp": { $gt: Date.now() }, "reset_password.status": true }, 
				{email: 1, password: 1, reset_password: 1, customer_name:1},
				function(err, user){
					if(!err && user){
						user.password = req.body.password;
						user.reset_password = {
							status: false
						};
						user.save(function(err, saved){
							if(err){
								return next(err);
							} else {
								// Remove sensitive data before return authenticated user
	                    		user.password = undefined;
								res.json(
									response.success({
										success: true,
										message: 'Password has been changed successfully.'
									})	
								);
								done(err, user);
							}
						});
					} else {
						res.status(400).json(
							response.error({
								source: err,
								success: false,
				        		message: 'Password reset token is invalid or has been expired.'	
							})
				        );
					}	
				}
			);	
		},
		function(user, done){
			mail.send({
				subject: 'Your password has been changed',
				html: './public/email_templates/user/reset-password-confirm.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
					customer_name: user.customer_name || 'User'
				}
			},done);
		}
	], function (err) {
		if (err) {
			return next(err);
		}
	});
};

function forgotByEmail(req, res, next) {
	async.waterfall([
		// find the user
		function(done){
			User.findOne({ email: req.body.email, role: { $ne: "admin" } }, 'email email_verified deactivate status customer_name',function(err, user){
				if(err){
					done(err, null);
				} else {
					let errors = null, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { name: 'Authentication failed', message: 'No account with that email has been found', success: false};
							error = true;
							break;

						// 2. IF User Email is Not Verified
						case (!user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your email is not verified, kindly verify your email.', success: false};
							error = true;
							break;

						// 3. IF User has deactivate his account
						case (user.deactivate):
							errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
							error = true;
							break;

						// 4. IF Admin has Deactivate User Account
						case (!user.status && user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;

						default: 
							error = false;
					}
					done(errors, user);
				}
			});
		},
		// Generate random token
		function (user, done) {
			crypto.randomBytes(20, function (err, buffer) {
				let token = buffer.toString('hex');
	        	done(err, user, token);
	      	});
	    },
	    // Lookup user by email
	    function (user, token, done) {
			User.update(
				{_id: user._id},
				{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} }, 
				{ runValidators: true, setDefaultsOnInsert: true },
				function(err, result){
					done(err, token, user, result);
				}
			);
	    },
		// If valid email, send reset email using service
		function(token, user, done){
			let baseUrl = `${req.protocol}://${req.headers.host}`;
			mail.send({
				subject: 'Reset your password',
				html: './public/email_templates/user/forgotpassword.html',
				from: config.mail.from, 
				to: user.email,
				emailData : {
		   		    changePasswordLink: `${baseUrl}/api/reset/${token}`,
		   		    customer_name: user.customer_name
		   		}
			}, function(err, success){
				if(err){
					res.status(500).json(
						response.error({
							source: err,
							message: 'Failure sending email',
							success: false
						})
			        );
				} else {
					res.json(
						response.success({
							success: true,
			        		message: 'An email has been sent to the provided email with further instructions.'
						})	
			        );
				}
			});
		}
	], function (err) {
		if(err){
			res.status(500).json( response.error( err ) );
		}
	});
}
function random() {
	let string = "QWERTYUIOPLKJHGFDSAZXCVBNM12346790";
	let rand = string.split('');
	let shuffle = _.shuffle(rand);
	let num = _.slice(shuffle,0,4);
	return num.join("");
}
function forgotByMobile(req, res, next) {
	if( !req.body.mobile ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
		.json(response.required({message: 'Valid Mobile Number is required'}));
	}

	async.waterfall([
		// find the user
		function(done){
			User.findOne({ mobile: req.body.mobile, role: { $ne: "admin" } }, 'email email_verified deactivate mobile status',function(err, user){
				if(err){
					done(err, null);
				} else {
					let errors = null, error = false;
					switch(_.isNull(user) || !_.isNull(user)){
						// 1. IF User Not Found in Database
						case _.isNull(user):
							errors = { name: 'Authentication failed', message: 'No account with that mobile number has been found', success: false};
							error = true;
							break;

						// 2. IF User Email is Not Verified
						case (!user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your registered email is not verified, kindly verify your email.', success: false};
							error = true;
							break;

						// 3. IF User has deactivate his account
						case (user.deactivate):
							errors = { name: 'Authentication failed', message: 'Your account is deactivate.', success: false};
							error = true;
							break;

						// 4. IF Admin has Deactivate User Account
						case (!user.status && user.email_verified):
							errors = { name: 'Authentication failed', message: 'Your account is deactivated by admin, please contact admin.', success: false};
							error = true;
							break;

						default: 
							error = false;
					}
					done(errors, user);
				}
			});
		},
	    // Lookup user by email
	    function (user, done) {
	    	let token = random();
			User.update(
				{_id: user._id},
				{ reset_password: { token: token, timestamp: Date.now() + 86400000, status: true} }, 
				{ runValidators: true, setDefaultsOnInsert: true },
				function(err, result){
					done(err, token, user);
				}
			);
	    },
		// If valid email, send reset email using service
		function(token, user, done){
	        twilio.sms(`Verification code - ${token}`, req.body.mobile)
			.then(result => res.json(response.success({success: true, message: 'Verification code has been sent on your mobile number'})))
			.catch(error => done(error));
		}
	], function (err) {
		if(err){
			res.status(500).json( response.error( err ) );
		}
	});
};