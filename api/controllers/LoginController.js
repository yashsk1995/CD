/**
 * LoginController
 *
 * @description :: Server-side logic for managing login
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var url = require('url');
var next = require('co-next');
var bcrypt = require('bcrypt');

module.exports = {

  login: function (req, res) {
    LoginService.login(req, res, sails.config.app_constants.user_types.end_user).then(function (user) {
      return res.send({
        status: 'success',
        message: '',
        error: ''
      });
    }).catch(function (err) {
      return res.send({
        status: 'failed',
        message: '',
        error: err
      });
    });
  },


  forgotPassword: function (req, res) {
    var email = req.param('email');
    LoginService.forgotPassword(req, email).then(function (response) {
      return res.send({
        status: 'success',
        message: 'An Email has been sent to your email address with forgot Password URL',
        error: ''
      });
    }).catch(function (error) {
      return res.send({
        status: 'failed',
        message: 'Unable to process forgot password',
        error: err
      });

    });
  },


  renderResetPassword: function (req, res, next) {
    var token = req.param('token');
    VerificationTokenService.isValid(token).then(function (verificationToken) {
      return res.view('reset_password', {layout: '', token: token, error: {}, message: ''});
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
      return res.view('reset_password', {
        layout: '',
        token: token,
        error: error,
        message: ''
      });
    }

    LoginService.resetPassword(token, password).then(function (response) {
      var user = response[0];
      if (user.type == sails.config.app_constants.user_types.end_user) {
        return res.redirect('/');
      }
      return res.redirect('adminaccess');
    }).catch(function (error) {
      return res.view('reset_password', {
        layout: '',
        error: error,
        token: token,
        message: error.message || 'Unable to reset Password'
      });
    });
  },

  render: next(function* (req, res) {
    res.locals.layout = 'new/homelayout';
    console.log('session', req.session);
	if(typeof req.session.authenticated != 'undefined' && req.session.authenticated){
		 return res.redirect('/');
	}	
    res.view('new/pages/loginpage', {
      isAuthenticated: req.session.authenticated ? true : false
    });
  }),

  renderRegister: next(function* (req, res) {
    res.locals.layout = 'new/homelayout';
	if(typeof req.session.authenticated != 'undefined' && req.session.authenticated){
		 return res.redirect('/');
	}
    res.view('new/pages/registerpage', {
    });
  }),

  apiRegister: function (req, res) {
    // var first_name = req.param('first_name');
    // var last_name = req.param('last_name');
    // var phone = req.param('phone');
    // var email = req.param('email');
    // var company_name = req.param('company_name');
    // var state = req.param('state');
    // var job = req.param('job');
    // var user_name = req.param('user_name');
    // var password = req.param('password');

    var newUser = req.allParams();

    UserService.createNew(newUser).then(function (users) {
      req.session.authenticated = true;
      req.session.user = {};
      req.session.user['first_name'] = newUser.first_name;
      req.session.user['last_name'] = newUser.last_name;
      req.session.user['email'] = newUser.email;
      // req.session.user['username'] = newUser.user_name;
      return res.send({
        success: true
      });
    }).catch(function (error) {
      return res.send({
        success: false
      });
    });
  },

  apiLogin: function(req, res){
    var email = req.param('email');
    var password = req.param('password');

    NewUser.findOne({email: email}).exec(function (err, user) {
      if(err){
        req.session.authenticated = false;
        req.session.user = {};
        return res.send({
          success: false
        })
      }

      if(!user){
        req.session.authenticated = false;
        req.session.user = {};
        return res.send({
          success: false
        })
      }

      bcrypt.compare(password, user.password, function(err, result){
        if(result){
          req.session.authenticated = true;
          req.session.user = {};
          req.session.user['first_name'] = user.first_name;
          req.session.user['last_name'] = user.last_name;
          req.session.user['email'] = user.email;
          // req.session.user['username'] = user.user_name;
          return res.send({
            success: true
          })
        }
        else{
          req.session.authenticated = false;
          req.session.user = {};
          return res.send({
            success: false
          })
        }
      })
    });
  },

  apiLogout: function(req, res){
    req.session.authenticated = false;
    req.session.user = {};
    res.send({
      success:  true
    })
  },

  renderPasswordReset: function(req, res){
    res.locals.layout = 'new/homelayout';
    res.view('new/pages/passwordreset', {
      params: req.allParams()
    });
  },

  doPasswordReset: function(req, res){
    
    var params = req.allParams();
    var email = params['email'];

    NewUser.findOne({email: email}).exec(function (err, user) {
      if(err){
        res.locals.layout = 'new/homelayout';
        params['error'] = true;
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      if(!user){
        res.locals.layout = 'new/homelayout';
        params['error'] = true;
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      // email = 'jaygangkun@hotmail.com';
      var reset = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      console.log('reset:', reset);
      var protocol = req.connection.encrypted?'https':'http';
      var baseUrl = protocol + '://' + req.headers.host;
      var set_password_link = baseUrl + '/password-set?reset=' + reset;
      var logo_url = baseUrl + '/images/frontend/sh_logo.png';
      console.log('base_url:', set_password_link);
      console.log('logo_url:', logo_url);

      UserService.updateNew({email: email}, {reset: reset});
      sails.hooks.email.send('resetPassword', 
        {
          link: set_password_link,
          logo_url: logo_url
        }, {
          to: email,
          subject: 'Password Reset',
          from: 'info@silverhillfunding.com'
        }, function(err) {console.log(err);})

      res.locals.layout = 'new/homelayout';
      res.view('new/pages/passwordreset', {
        params: params
      });

    });
    
  },

  renderPasswordSet: function(req, res){
    var params = req.allParams();

    if(!params.hasOwnProperty('reset')){
      res.locals.layout = 'new/homelayout';
      res.view('new/pages/passwordreset', {
        params: req.allParams()
      });
      return;
    }

    NewUser.findOne({reset: params['reset']}).exec(function (err, user) {
      if(err){
        res.locals.layout = 'new/homelayout';
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      if(!user){
        res.locals.layout = 'new/homelayout';
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      console.log('reset:', params['reset']);
      res.locals.layout = 'new/homelayout';
      params['id'] = user.id;
      res.view('new/pages/passwordset', {
        params: params
      });
    });
    
  },

  doPasswordSet: function(req, res){
    var params = req.allParams();
    
    if(!params.hasOwnProperty('id')){
      res.locals.layout = 'new/homelayout';
      res.view('new/pages/passwordreset', {
        params: req.allParams()
      });
      return;
    }

    NewUser.findOne({id: params['id']}).exec(function (err, user) {
      if(err){
        res.locals.layout = 'new/homelayout';
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      if(!user){
        res.locals.layout = 'new/homelayout';
        return res.view('new/pages/passwordreset', {
          params: params
        });
      }

      console.log('id:', params['id']);
      UserService.updateNew({id: params['id']}, {password: params['password'], reset: ''});
      res.locals.layout = 'new/homelayout';
      params['success'] = true;
      res.view('new/pages/passwordset', {
        params: params
      });
    });
  },

  apiCheck: function (req, res) {
    var params = req.allParams();
    NewUser.findOne({email: params['email']}).exec(function (err, user) {
      if(err){
        return res.send({
          exist:  false
        })
      }

      if(!user){
        return res.send({
          exist:  false
        })
      }

      return res.send({
        exist:  true
      })
    });
  }
};

