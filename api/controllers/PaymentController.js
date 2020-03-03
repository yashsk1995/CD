/**
 * Created by zeeshan on 7/7/2017.
 */
/**
 * PaymentController
 *
 * @description :: Server-side logic for managing login
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var url = require('url');

module.exports = {


  _render: function (res, isShowEmail, fee, user, error) {
    return res.view('payment_home', {
      isShowEmailModal: isShowEmail,
      user: user,
      error: error,
      feeDetails: fee,
      payPal: sails.config.paypal
    });
  },

  render: function (req, res) {
    var _this = this;
    var email = req.param('email');
    var user = {};
    if (email) {
      return UserService.findByEmail(email, true).then(function (foundUser) {
        user = foundUser;
        if (user && Object.keys(user).length > 0 && user.type == sails.config.app_constants.user_types.end_user) {
          if (!user.endUser.isPaidAccount) {
            return SalesForceService.verifyUserPayment(user).then(function (fee) {
              var error = {};
              if (!fee) {
                error = {message: 'This email doesn\'t have permission for payment'};
              }
              return _this._render(res, false, fee, user, error);
            });
          }
          return _this._render(res, false, {}, {}, {message: 'This user has already paid'});
        }
        return _this._render(res, false, {}, {}, {message: 'User is invalid'});
      }).catch(function (error) {
        return _this._render(res, false, {}, {}, {message: 'User is invalid'});
      });
    }
    return _this._render(res, true, {}, {}, {message: 'Email not found'});
  },

  confirmPayPalPayment: function (req, res) {
    var paymentId = req.param('payment_id');
    var userId = req.param('user_id');
    var amount = req.param('amount');
    var feeId = req.param('fee_id');

    var paymentType = 'PayPal';

    PayPalService.verifyPayment(paymentId).then(function (isVerified) {
      if (isVerified) {
        return EndUserService.update(userId, {isPaidAccount: true}).then(function () {
          return SalesForceService.updateUserPayment(feeId, amount, paymentType, paymentId);
        }).then(function (response) {
          res.send({status: 'success', message: 'Payment Verified'});
        }).catch(function (response) {
          res.send({status: 'success', message: 'Payment Verified'});
        });
      }
      res.send({status: 'failed', error: 'Unable to verify payment please try again'});
    }).catch(function (error) {
      res.send({status: 'failed', error: error});
    });
  }

};

