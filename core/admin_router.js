'use strict';
const path 	= require('path'),
_ 			= require('lodash'),
multer 		= require('multer'),
config 		= require(require(path.resolve('./core/env')).getEnv),
fs 			= require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/Admin')).forEach(file => {
	let name = file.substr(0,file.indexOf('.js'));
	ctrls[name] = require(path.resolve(`./controllers/Admin/${name}`));
});

let uploadImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/blog/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
    
});

let uploadHomepageBanner = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/homepage_banner/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
    
});

let uploadTestimonialImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/testimonial/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
    
});

let uploadProfileImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/profile_image/',
    	filename: function (req, file, cb) {
    		cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
  		}
    }),
    fileFilter: fileFilter
});

let subscriptionPlanImage = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/subscription_plan_image/',
      filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + config.file_extensions[file.mimetype]);
      }
    }),
    fileFilter: fileFilter
});

/* Check if file is valid image */
function fileFilter (req, file, cb) {
	if(!_.includes(config.allowed_image_extensions, file.mimetype)){
		cb(new Error('Invalid image file'));
	}
	cb(null, true);
}


module.exports = {
  	routes: [
  		{ url: '/login', method: ctrls.adminCtrl.login, type: 'post' },
      { url: '/forgotpassword', method: ctrls.adminCtrl.forgotpassword, type: 'post' },
      { url: '/reset/:token', method: ctrls.adminCtrl.validateResetToken, type: 'get' },
      { url: '/reset_password/:token', method: ctrls.adminCtrl.reset, type: 'post' },
      { url: '/user/list', method: ctrls.userCtrl.list, type: 'post' },
      { url: '/user/add', mwear:uploadProfileImage.any(),method: ctrls.userCtrl.add, type: 'post' },
      { url: '/user/view/:id', method: ctrls.userCtrl.view, type: 'get' },
      { url: '/user/edit/:id', mwear: uploadProfileImage.any(), method: ctrls.userCtrl.edit, type: 'put' },
      { url: '/user/exportcsv', method: ctrls.userCtrl.exportcsv, type: 'get' },
      { url: '/cms/add', method: ctrls.cmsCtrl.add, type: 'post' },
  		{ url: '/cms/list', method: ctrls.cmsCtrl.list, type: 'post' },
  		{ url: '/cms/edit', method: ctrls.cmsCtrl.edit, type: 'put' },
  		{ url: '/cms/view/:slug', method: ctrls.cmsCtrl.view, type: 'get' },
      { url: '/homepage/edit', mwear:uploadHomepageBanner.any(),method: ctrls.homepageCtrl.edit, type: 'post' },
      { url: '/homepage/view', method: ctrls.homepageCtrl.view, type: 'get' },
      { url: '/homepage/remove_banner/:path', method: ctrls.homepageCtrl.delete, type: 'delete' },
  		{ url: '/privacypolicy/add',  method: ctrls.privacypolicyCtrl.add, type: 'post' },
      
      { url: '/subscription/list', method: ctrls.subscriptionCtrl.list, type: 'post' },
      { url: '/subscription/add', mwear:subscriptionPlanImage.any(),method: ctrls.subscriptionCtrl.add, type: 'post' },
      { url: '/subscription/view/:id', method: ctrls.subscriptionCtrl.view, type: 'get' },
      { url: '/subscription/edit/:id', mwear: subscriptionPlanImage.any(), method: ctrls.subscriptionCtrl.edit, type: 'put' },
      { url: '/userCount', method: ctrls.userCtrl.userCount, type: 'get' },
      { url: '/subscriptionCount', method: ctrls.userCtrl.subscriptionCount, type: 'get' },
      { url: '/paymentCount', method: ctrls.paymentCtrl.paymentCount, type: 'get' },
      { url: '/payment/list', method: ctrls.paymentCtrl.list, type: 'post' },
      { url: '/payment/view/:id', method: ctrls.paymentCtrl.view, type: 'get' },
  		/*{ url: '/privacypolicy/add',  method: ctrls.privacypolicyCtrl.add, type: 'post' },
      { url: '/privacypolicy/list', method: ctrls.privacypolicyCtrl.list, type: 'post' },
      { url: '/privacypolicy/edit', method: ctrls.privacypolicyCtrl.edit, type: 'put' },
      { url: '/privacypolicy/view/:id', method: ctrls.privacypolicyCtrl.view, type: 'get'},
      { url: '/blog/add', mwear: uploadImage.any(), method: ctrls.blogCtrl.add, type: 'post' },
  		{ url: '/blog/list', method: ctrls.blogCtrl.list, type: 'post' },
  		{ url: '/blog/view/:slug', method: ctrls.blogCtrl.view, type: 'get' },
      { url: '/faq/add', method: ctrls.faqCtrl.add, type: 'post' },
  		{ url: '/faq/list', method: ctrls.faqCtrl.list, type: 'post' },
  		{ url: '/faq/edit', method: ctrls.faqCtrl.edit, type: 'put' },
  		{ url: '/faq/view/:id', method: ctrls.faqCtrl.view, type: 'get' },
  		{ url: '/testimonial/add', mwear: uploadTestimonialImage.any(), method: ctrls.testimonialCtrl.add, type: 'post' },
  		{ url: '/testimonial/list', method: ctrls.testimonialCtrl.list, type: 'post' },
  		{ url: '/testimonial/view/:id', method: ctrls.testimonialCtrl.view, type: 'get' },
      { url: '/cmsLink/add', method: ctrls.cmsLinkCtrl.add, type: 'post' },
      { url: '/cmsLink/list', method: ctrls.cmsLinkCtrl.list, type: 'post' },
      { url: '/cmsLink/edit', method: ctrls.cmsLinkCtrl.edit, type: 'put' },
      { url: '/cmsLink/view/:id', method: ctrls.cmsLinkCtrl.view, type: 'get' }*/
	]
};