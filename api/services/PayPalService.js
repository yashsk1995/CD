/**
 * Created by zeeshan on 7/12/2017.
 */
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': sails.config.paypal.mode,
  'client_id': sails.config.paypal.clientId,
  'client_secret': sails.config.paypal.secretKey
});

module.exports = {

  verifyPayment: function (paymentId) {
    return new Promise(function (resolve, reject) {
      paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          if (payment.state == 'approved') {
            resolve(true);
          } else {
            reject({message: 'Unable to process payment'});
          }
        }
      });

    });
  }
};
