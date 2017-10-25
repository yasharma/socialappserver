'use strict';
const 
	path 		= require('path'),
	response 	= require(path.resolve('core/lib/response')),
	User 		= require(path.resolve('models/User')),
	Payment 	= require(path.resolve('models/Payment')),
	Subscription = require(path.resolve('models/Subscription')),
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
		res.json(response.success({message: 'Your details has been saved successfully and trial subscription has initiated'}));
	});
};

exports.createCharge = (req, res, next) => {
	if( !req.body.user_id ) {
		return res.status(response.STATUS_CODE.UNPROCESSABLE_ENTITY)
				.json(response.required({message: 'User id is required'}));
	}
	const { user_id, plan_id } = req.body;
	async.waterfall([
		function (done) {
			async.parallel({
				user: (callback) => {
					User.findOne({_id: user_id},{stripe: 1, email: 1},callback);	
				},
				plan: (callback) => {
					Subscription.findOne({_id: plan_id},{name: 1, price: 1},callback);
				}
			},done);
		},
		function (result, done) {
			const{ user, plan } = result;
			if( !user.stripe ) {
				done('Kindly add your credit card details before procced');
			} else {
				stripe.charges.create({
				  	amount: (plan.price * 100), // 10 * 100 = $10
				  	currency: "usd",
				  	customer: user.stripe.customer.id, // obtained with Stripe.js
				  	source: user.stripe.customer.default_source,
				  	description: `Charge for ${user.email}`,
				  	receipt_email: user.email
				}, function(err, charge) {
					if( err ) {
						let message = err.message;
						if ( err.rawType === 'invalid_request_error' ) {
							message = 'You must add credit card details in settings under saved card tab, before add a new website';
						}
						done({message: message});	
					} else {
						done(null, charge, user);
					}
				});
			}
		},
		function (charge, user, done) {
			let payment = new Payment({
				payment_id: charge.id,
				amount: charge.amount,
				balance_transaction: charge.balance_transaction,
				customer: charge.customer,
				description: charge.description,
				user_id: user._id,
				plan_id: plan_id
			});
			payment.save(done);
		}
	], function (err, result) {
		if( err ) {
			return res.status(500).json(response.error(err));
		}
		res.json(response.success({message: 'Payment transaction finished, saving details ...'}));
	});
}

exports.listCards = (req, res, next) => {
	
	async.waterfall([
		function (done) {
			User.findOne({_id: req.params.id}, {stripe: 1}, done)
		},
		function (user, done) {
			if( user.stripe.customer && user.stripe.customer.id ) {
				stripe.customers.listCards(user.stripe.customer.id, function(err, cards) {
  					done(err, cards)
				});
			} else {
				done(null, []);
			}
		}
	], function (err, result) {
		if( err ) {
			return res.status(500).json(response.error(err));
		}
		res.json(response.success(result));
	});
};