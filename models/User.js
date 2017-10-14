'use strict';

const mongoose 	= require('mongoose'),
path 			= require('path'),
crypto 			= require('crypto'),
config 			= require(require(path.resolve('./core/env')).getEnv),
uniqueValidator = require('mongoose-unique-validator'),
Schema 			= mongoose.Schema,

UserSchema 	= new Schema({
	profile_image:{
		name: {
			type: String,
			default: config.image_name
		},
		path: {
			type: String,
			default: config.image_path
		}
	},
	customer_name: {
		type: String,
		maxlength: [200, 'Customer Name cannot be more then {MAXLENGTH} characters.']
	},
	customer_url: {
		type: String,
		maxlength: [200, 'Customer Url cannot be more then {MAXLENGTH} characters.']
	},
	mobile: {
		type: String,
		unique: 'This mobile number is already registered with us',
		maxlength: [200, 'Mobile Number cannot be more then {MAXLENGTH} characters.']
	},
	business_name: {
		type: String,
		maxlength: [20, 'Business Name cannot be more then {MAXLENGTH} characters.']
	},
	reset_password: {type: Object},
	role: {
		type: String,
		enum: {
			values: ['subadmin', 'admin', 'user'],
			message: '{VALUE} is not a valid role for user'
		},
		default: 'user'
	},
	email: {
		type: String,
		lowercase: true,
    	trim: true,
		unique: 'The Email address you have entered already exists.',
		uniqueCaseInsensitive:true,
		required: 'E-mail is required',
		validate: {
			validator: function(email) {
				return /^([\w-\.+]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
			},
			message: '{VALUE} is not a valid email address'
		}
	},
	email_verified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: 'Password is required',
		minlength: [6, 'Password must be atleast 6 characters long.']
	},
	status: {
		type: Boolean,
		default: false
	},
	salt: { type: String },
	lastLoggedIn: { type: Date },
	ip: { type: String },
	//subscription_plan:{type: Array}
	subscription_plan: [
       {
		website_url: {
			type: String
		},
		plan_name: {
			type: String
		},
		plan_price: {
			type: Number
		},
		plan_type: {
			type: String
		},
		duration: {
			type: Number,
			default: 14
		},
		start_date: {
			type: Date,
			default: Date.now
		},
		renew_date: {
			type: Date
		},
		expiration_date: {
			type: Date
		}
      }
     ]
	
},{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

/* Mongoose beforeSave Hook : To hash a password */
UserSchema.pre('save', function(next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        user.salt = crypto.randomBytes(16).toString('hex');
        user.password = this.hashPassword(config.salt, user.password);
        next();
    } else {
        return next();
    }
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(salt, password) {
    if (salt && password) {
        return crypto.createHmac('sha512', salt).update(password).digest('base64');
    } else {
        return password;
    }
};


/* To check a password */
UserSchema.methods.comparePassword = function(salt, password) {
    return this.password === this.hashPassword(salt, password);
};

UserSchema.set('autoIndex', config.db.autoIndex);
UserSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator'
});
module.exports = mongoose.model('User', UserSchema);