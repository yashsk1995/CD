/**
 * Created by zeeshan on 6/8/2017.
 //  */
var assert = require('chai').assert;

describe('Email Service', function () {
  it('should send welcome email', function (done) {
    this.timeout(10000);
    EmailService.sendWelcomeEmail({
      email: 'test@test.com'
    }, 'password123').then(function (response) {
      assert.isDefined(response);
      done();
    }).catch(function (error) {
      assert.isUndefined(error);
      done();
    });
  });

  it('should send forgot password email', function (done) {
    this.timeout(10000);

    EmailService.sendForgotPasswordEmail({
      email: 'test@test.com'
    }, 'token1234').then(function (response) {
      assert.isDefined(response);
      done();
    }).catch(function (error) {
      assert.isUndefined(error);
      done();
    });

  });

});
