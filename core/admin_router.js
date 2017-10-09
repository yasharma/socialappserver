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

let uploadCMSBanner = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
    	destination: 'assets/cms_banner/',
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
      { url: '/user/list', method: ctrls.userCtrl.list, type: 'post' },
      { url: '/user/add', mwear:uploadProfileImage.any(),method: ctrls.userCtrl.add, type: 'post' },
      { url: '/user/view/:id', method: ctrls.userCtrl.view, type: 'get' },
      { url: '/user/edit/:id', mwear: uploadProfileImage.any(), method: ctrls.userCtrl.edit, type: 'put' },
      { url: '/setting', method: ctrls.adminCtrl.setting, type: 'post' },
  		{ url: '/cms/add', method: ctrls.cmsCtrl.add, type: 'post' },
  		{ url: '/cms/list', method: ctrls.cmsCtrl.list, type: 'post' },
  		{ url: '/cms/edit', method: ctrls.cmsCtrl.edit, type: 'put' },
  		{ url: '/cms/view/:slug', method: ctrls.cmsCtrl.view, type: 'get' },
	]
};