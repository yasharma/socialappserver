"use strict";
const config = {
	db: {
		URL: 'mongodb://localhost/socialproof',
		DEBUG: true,
		autoIndex: true,
    options: {
      useMongoClient: true
    }
	},
	server: {
    host: 'http://localhost',
		PORT: 9000
	},
	mail:{
		poolConfig : {
			pool: true,
		    host: 'smtp.gmail.com', // Gmail as mail client
		    port: 465,
		    secure: true, // use SSL
		    auth: {
		    	user: process.env.USERNAME,
		    	pass: process.env.PASSWORD
		    }
		},
		from: `RtiGuru ${process.env.USERNAME}`
	},
	twilio: {
		number: process.env.TWILIO_NUMBER,
		accountSid: process.env.ACCOUNT_SID,
		authToken: process.env.AUTH_TOKEN,
		countryCode: '+91'
	},
   	mailTransporter: 'gmail',
   	salt: '51ca5acbce3e6a5b2dd9772b36cff34c',
   	secret: '876sdf&%&^435345(*^&^654sdsdc&^&kjsdfjbksdureyy3(&(*&(&7$%^#%#&^*(&)*)*',
   	allowed_image_extensions : ['image/jpeg','image/jpg','image/png','image/gif','image/bmp'],
   	file_extensions : {
   		'image/jpeg' : 'jpg',
   		'image/jpg' : 'jpg',
   		'image/png' : 'png',
   		'image/gif' : 'gif',
   		'image/bmp' : 'bmp',
   	},
    blog_image_destination: 'assets/blog',
   	image_path: 'images/',
   	image_name: 'noimage.jpg',
   	fileLimits: {
        fileSize: 2000000, //the max file size (in bytes)
        files: 10 //the max number of file
    },
    docLimit: 10,
    defaultAdmin: {
    	email: 'admin@gmail.com',
    	password: '123456',
    	role: 'admin',
    	status: true,
      email_verified: true
    }
};
module.exports = config;