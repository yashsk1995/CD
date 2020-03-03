/**
 * Created by zeeshan on 3/1/2017.
 */
var passport = require('passport');

module.exports = {

  login: function (req, res, userType) {

    return new Promise(function (resolve, reject) {
      passport.authenticate('local', function (err, user, info) {
        if ((err) || (!user)) {
          return reject({message: info.message});
        }
        if (user.status && user.status.toLowerCase() == sails.config.app_constants.user_status.deleted.toLowerCase()) {
          return reject({message: "Account is inactive, Please contact Administrator"});
        }

        if (!user.type || (user.type.toLowerCase() != userType.toLowerCase())) {
          return reject({message: "Invalid Credentials"});
        }

        UserService.updateLoginInfo(user, req.ip, function (err, updatedUser) {
          if (err) {
            return reject({message: 'Unable to Login'});
          }
          req.logIn(updatedUser ? updatedUser : user, function (err, response) {
            if (err) {
              return reject({message: 'Unable to Login'});
            }
            return resolve(response);
          });
        });
      })(req, res);
    });
  },

  forgotPassword: function (req, email) {
    return UserService.findByEmail(email).then(function (user) {
      return user;
    }).then(function (user) {
      if (!user) {
        return {};
      }
      var randomToken = CryptoService.generateRandomToken();
      return VerificationTokenService.deleteByUser(user.id, user.type).then(function () {
        return VerificationTokenService.create(randomToken, user.id, user.type);
      }).then(function (verificationToken) {
        return verificationToken;
      }).then(function (verificationToken) {
        return EmailService.sendForgotPasswordEmail(req, user, randomToken);
      });
    });
  },

  resetPassword: function (token, password) {
    return VerificationTokenService.isValid(token).then(function (verificationToken) {
      return verificationToken;
    }).then(function (veriToken) {
      return UserService.findById(veriToken.userId);
    }).then(function (user) {
      var params = {password: password};
      return UserService.update(user.id, params);
    }).then(function (user) {
      return Promise.all([user, VerificationTokenService.deleteByToken(token)]);
    });
  }
};
