'use strict';
const path  = require('path'),
_       = require('lodash'),
multer    = require('multer'),
config    = require(require(path.resolve('./core/env')).getEnv),
fs      = require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
  let name = file.substr(0,file.indexOf('.js'));
  ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
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

let uploadClientCsv = multer({
    limits: config.fileLimits,
    storage: multer.diskStorage({
      destination: 'assets/client_list_csv/',
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
      { url: '/register', method: ctrls.userCtrl.register, type: 'post' },
      { url: '/login', method: ctrls.userCtrl.login, type: 'post' },
      { url: '/forgot_password', method: ctrls.userCtrl.forgot, type: 'post' },
      { url: '/reset/:token', method: ctrls.userCtrl.validateResetToken, type: 'get' },
      { url: '/reset_password/:token', method: ctrls.userCtrl.reset, type: 'post' },
      { url: '/verify_email/:salt', method: ctrls.userCtrl.verifyEmail, type: 'get' },
      { url: '/cmsLinks', method: ctrls.cmsCtrl.getCmsLinks, type: 'get' },
      { url: '/cms/get/:slug', method: ctrls.cmsCtrl.getCMS, type: 'get' },
      { url: '/settings', method: ctrls.cmsCtrl.getSettings, type: 'get' },
      { url: '/add_website', method: ctrls.userSubscriptionCtrl.addWebsite, type: 'post' },
      { url: '/website_list', method: ctrls.userSubscriptionCtrl.websiteList, type: 'post' },
      { url: '/subscription_list', method: ctrls.userCtrl.subscriptionList, type: 'get' },
      { url: '/change_password/:id', method: ctrls.userCtrl.changePassword, type: 'post' },
      { url: '/customer', method: ctrls.stripeCtrl.createCustomer, type: 'post' },
      { url: '/initiate_payment', method: ctrls.stripeCtrl.createCharge, type: 'post' },
      { url: '/list_cards/:id', method: ctrls.stripeCtrl.listCards, type: 'get' },
      { url: '/trail', method: ctrls.userCtrl.trailPlan, type: 'post' },
      { url: '/plans_list', method: ctrls.plansCtrl.planList, type: 'get' },
      { url: '/profile', mwear: uploadProfileImage.any(),method: ctrls.userCtrl.updateProfile, type: 'post' },
      { url: '/import_client_list', mwear:uploadClientCsv.any(),method: ctrls.clientListCtrl.importClientList, type: 'post' },
      { url: '/client_list',method: ctrls.clientListCtrl.clientList, type: 'post' },
      { url: '/export_client_list',method: ctrls.clientListCtrl.exportClientList, type: 'post' },

  ]
};