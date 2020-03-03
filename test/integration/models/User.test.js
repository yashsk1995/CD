/**
 * Created by zeeshan on 6/8/2017.
 */
var User = require('../../../api/models/User'),
  assert = require('assert');

describe('User Model', function () {
  it('should hash the password before user is created', function (done) {
    User.beforeCreate({
      password: 'password'
    }, function (err, user) {
      assert.notEqual(user.password, 'password');
      done();
    });
  });

  it('should hash the password before user is updated', function (done) {
    User.beforeUpdate({
      password: 'password'
    }, function (err, user) {
      assert.notEqual(user.password, 'password');
      done();
    });
  });
});
