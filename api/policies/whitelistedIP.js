/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Check whether IP is allowed to access admin pannel.
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (sails.config.environment == 'development' || sails.config.environment == 'test') {
    return next();
  }
  var ip = req.ip;
  console.log("[WhitelistedIP][IP]");
  console.log(ip);
  WhitelistedIPService.isIPExist(ip).then(function (isExist) {
    if (isExist) {
      return next();
    }
    return res.redirect('/404');
  }).catch(function (err) {
    return res.redirect('/404');
  });

};

