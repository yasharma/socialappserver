"use strict";

const nodemailer	= require('nodemailer'),
	path 			= require('path'),
	config      	= require(require(path.resolve('./core/env')).getEnv),
	fs 				= require('fs'),
	template 		= require(path.resolve('./core/lib/template-render'));

// Send mail by GMAIL SMTP
function gmailSMTP(opt, cb) {
	var poolConfig = config.mail.poolConfig,
	transporter = nodemailer.createTransport(poolConfig);
	sendMailer(opt, transporter, cb);
}

function sendMailer(opt, transporter, cb) {
	transporter.verify((error, success) => {
	   	if (error) {
	        cb(error);
	   	} else {
	   		// setup email data with unicode symbols
	   		let mailOptions = {
	   		    from: opt.from || config.mail.from, // sender address
	   		    to: opt.to, // list of receivers
	   		    subject: opt.subject, // Subject line
	   		    html: template.render(fs.readFileSync(opt.html, 'utf-8'), null, opt.emailData), // html body
	   		}; 
	   		// send mail with defined transport object
	   		transporter.sendMail(mailOptions, (error, info) => {
	   		    if (error) {
	   		        cb(error);
	   		    } else {
	   		    	cb(null, info);
	   		    }
	   		});
	   	}
	});
}

exports.send = function (opt, cb) {
	gmailSMTP(opt, cb);	
};