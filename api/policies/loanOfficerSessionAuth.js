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
  if (req.isAuthenticated() && req.user.type.toLowerCase() == sails.config.app_constants.user_types.admin.toLowerCase()
        && req.user.role.toLowerCase() == sails.config.app_constants.user_roles.loan_officer.toLowerCase()) {
    return next();
  }
  else {
    var redirect = req.originalUrl ? '?redirect=' + encodeURIComponent(req.originalUrl) : '';
    return res.redirect('/adminaccess' + redirect);
  }
};
