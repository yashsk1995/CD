/**
 * LoginController
 *
 * @description :: Server-side logic for managing login
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var url = require('url');

module.exports = {

  render: function (req, res) {
    if (req.isAuthenticated()
      && req.user.type.toLowerCase() == sails.config.app_constants.user_types.admin.toLowerCase()) {
      if(req.user.role.toLowerCase() == sails.config.app_constants.user_roles.editor){
        return res.redirect('adminaccess/blogcategories');
      }
      return res.redirect('adminaccess/dashboard');
    }
    return res.view('adminaccess/login', {layout: '', error: {}});
  },

  login: function (req, res) {
    LoginService.login(req, res, sails.config.app_constants.user_types.admin).then(function (user) {
      if (req.headers.referer) {
        var parsedUrl = url.parse(req.headers.referer, true);
        if (parsedUrl.query.redirect) {
          return res.redirect(parsedUrl.query.redirect);
        }
      }
      return res.redirect('adminaccess/blogcategories');
    }).catch(function (err) {
      return res.view('adminaccess/login', {layout: '', error: err});
    });

  },

  renderForgotPassword: function (req, res) {
    return res.view('adminaccess/forgot_password', {layout: '', message: ''});
  },

  forgotPassword: function (req, res) {
    var email = req.param('email');
    LoginService.forgotPassword(req, email).then(function (response) {
      return res.view('adminaccess/forgot_password', {
        layout: '',
        message: 'An Email has been sent to your email address with forgot Password URL '
      });
    }).catch(function (error) {
      return res.view('adminaccess/forgot_password', {layout: '', message: 'Unable to process forgot password'});
    });
  },

  renderResetPassword: function (req, res, next) {
    var token = req.param('token');
    VerificationTokenService.isValid(token, sails.config.app_constants.user_types.admin).then(function (verificationToken) {
      return res.view('adminaccess/reset_password', {layout: '', token: token, error: {}, message: ''});
    }).catch(function (err) {
      return next(err);
    });
  },

  resetPassword: function (req, res) {
    var password = req.param('password');
    var confirmPassword = req.param('confirmPassword');
    var token = req.param('token');

    var error = {};

    if (!password) {
      error['password'] = 'Password Cannot be empty';
    }

    if (!confirmPassword) {
      error['confirmPassword'] = 'Confirm Password Cannot be empty';
    }

    if (Object.keys(error).length == 0 && password != confirmPassword) {
      error['password'] = 'Password and Confirm Password does not match';
    }

    if (Object.keys(error).length > 0) {
      return res.view('adminaccess/reset_password', {
        layout: '',
        token: token,
        error: error,
        message: ''
      });
    }
    var userType = sails.config.app_constants.user_types.admin;
    LoginService.resetPassword(token, password, userType).then(function (response) {
      return res.redirect('adminaccess');
    }).catch(function (error) {
      return res.view('adminaccess/reset_password', {
        layout: '',
        error: error,
        token: token,
        message: error.message || 'Unable to reset Password'
      });
    });
  },


  logout: function (req, res) {
    req.logout();
    res.redirect('/adminaccess');
  }
};

