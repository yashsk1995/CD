/**
 * Created by zeeshan on 3/10/2017.
 */
var bcrypt = require('bcrypt');

module.exports = {

  encryptPassword: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return cb(err);
        }
        user.password = hash;
        return cb(err, user);
      });
    });
  },

  generateRandomToken: function () {
    var randomStr = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    var tokenStr = "";
    for (var i = 0; i < 32; i++) {
      tokenStr+= randomStr[Math.floor(Math.random() * randomStr.length)];
    }
    return tokenStr;
  }
}
