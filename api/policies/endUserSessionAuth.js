/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (req.isAuthenticated() &&
    req.user.type.toLowerCase() == sails.config.app_constants.user_types.end_user.toLowerCase()) {
    return next();
  }
  else {
    return res.redirect('/advance-calculator');
  }
};
