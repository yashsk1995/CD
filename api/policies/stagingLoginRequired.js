// in staging, all requests must be authenticated.
module.exports = function(req, res, next){
  if (sails.config.environment !== 'staging'
      || req.originalUrl === '/adminaccess'
      || req.isAuthenticated()){
      next();
    }
    else{
      res.redirect('/adminaccess');
    }
}