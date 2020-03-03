/**
 * Created by zeeshan on 3/1/2017.
 */
module.exports = {


  create: function (token, userId, userType) {
    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    var params = {
      token: token,
      userId: userId,
      userType: userType,
      expiredAt: expiryDate
    };

    return VerificationToken.create(params).then(function (token) {
      return token;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(EndUser, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },

  isValid: function (token) {
    var currentTime = new Date();
    return VerificationToken.findOne({
      token: token,
      expiredAt: {'>=': currentTime}
    }).then(function (verificationToken) {
      if (verificationToken) return verificationToken;
      throw {message: 'Token is not valid or expired'};
    }).catch(function (error) {
      throw error;
    });
  },

  deleteByUser: function (userId, userType) {
    return VerificationToken.destroy({userId: userId, userType: userType});
  },

  deleteByToken: function (token) {
    return VerificationToken.destroy({token: token});
  }

};
