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
  console.log("Req Host: " + req.host);
  if (req.host == 'localhost' || req.host == '127.0.0.1') {
    return next();
  }
  return res.redirect('/404');

};
