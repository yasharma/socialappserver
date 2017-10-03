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
      { url: '/blog/list/:type', method: ctrls.blogCtrl.list, type: 'get' },
      { url: '/faq/list', method: ctrls.faqCtrl.list, type: 'get' },
      { url: '/testimonial/list', method: ctrls.testimonialCtrl.list, type: 'get' },
  ]
};