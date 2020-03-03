/**
 * Created by zeeshan on 6/8/2017.
 */
var CryptoService = require('../../../api/services/CryptoService'),
  assert = require('chai').assert;

describe('Crypto Service', function () {
  it('should encrypt password', function (done) {
    CryptoService.encryptPassword({
      password: 'password'
    }, function (err, user) {
      assert.notEqual(user.password, 'password');
      done();
    });
  });

  it('should generate random token', function (done) {
    var token = CryptoService.generateRandomToken();
    assert.isNotEmpty(token);
    assert.lengthOf(token, 32);
    done();
  });

});
