'use strict';
const path  = require('path'),
_       = require('lodash'),
config    = require(require(path.resolve('./core/env')).getEnv),
fs      = require('fs');

/* Require All the controllers */
let ctrls = {};
fs.readdirSync(path.resolve('./controllers/User')).forEach(file => {
  let name = file.substr(0,file.indexOf('.js'));
  ctrls[name] = require(path.resolve(`./controllers/User/${name}`));
});


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
      { url: '/add_website', method: ctrls.userCtrl.addWebsite, type: 'post' },
      { url: '/subscription_list', method: ctrls.userCtrl.subscriptionList, type: 'get' }
  ]
};