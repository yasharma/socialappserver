'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User')),
	async 		= require('async'),
	_ 			= require('lodash'),
	mongoose 	= require('mongoose'),
	stripe 		= require('stripe')(process.env.STRIPE_TEST_API_KEY),
  	config 		= require(path.resolve(`./core/env/${process.env.NODE_ENV}`));

exports.createCustomer = (req, res, next) => {
	if( !req.body.email || !req.body.token ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'Email and Token is must to creare a customer'}));
	}
	const { email, token, description, ip } = req.body;
	async.waterfall([
		function stripeCustomerCreate(done) {
			stripe.customers.create({ 
				email: email,
				source: token,
				description: description,
				metadata: {
					plan: description
				}
			} )
			.then(customer => done(null, customer))
			.catch(error => done(error));		
		}, 
		function updateCustomer(customer, done) {
			User.update({email: email}, {
				$set: {
					stripe: {
						customer: {
							id: customer.id,
							account_balance: customer.account_balance,
							default_source: customer.default_source,
							description: customer.description	
						}
					},
					ip: ip
				}
			}, done);
		}
	], function (err, result) {
		if( err ) {
			return res.json(response.error(err));
		}
		res.json(response.success({message: 'Your details has been saved successfully and trail subscription has initiated'}));
	});
};