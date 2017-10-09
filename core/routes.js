"use strict";

const 	express 	= require('express'),
		path 		= require('path'),
		expressJWT 	= require('express-jwt'),
		config 		= require(require(path.resolve('./core/env')).getEnv),
		userRoutes 	= require(path.resolve('./core/user_router')),
		adminRoutes = require(path.resolve('./core/admin_router')),
		matchRoute 	= require(path.resolve('./core/lib/matchRoute')),
		router 		= express.Router(),
		admin 		= express.Router();



/* Express JWT middleware for user routes */
router.use(expressJWT({
	secret: new Buffer(config.secret).toString('base64'),
}).unless({
	// Define your path/routes that does not need any authentication
	path:[
		/^\/admin\/.*/,
		'/favicon.ico',
		'/api/register',
		'/api/login',
		'/api/forgot_password',
		'/api/cmsLinks',
		/^\/api\/(reset|reset_password)\/.*/,
		/^\/api\/verify_email\/.*/,
	]
}));
/*
* These are our base routes that will call simple prefixed by '/'
* eg. /login
*/
userRoutes.routes.forEach(x => matchRoute(router, x));

/*
* All the routes of admin will requests using admin prefix
* eg. /admin/login and so on
*/
/* Express JWT middleware for admin routes */
admin.use(expressJWT({
	secret: new Buffer(config.secret).toString('base64'),
}).unless({
	// Define your path/routes that does not need any authentication
	path:[
		'/admin/register',
		'/adminapi/login',
		'/adminapi/forgotpassword',
		/^\/adminapi\/reset|reset_password\/.*/,
		'/admin/forgot',
		/^\/admin\/reset|reset_password\/.*/,
		/^\/admin\/generate-password\/.*/
	]
}));
/*Admin Routes*/

adminRoutes.routes.forEach(x => matchRoute(admin, x));

module.exports = {
	router: router,
	admin: admin
};