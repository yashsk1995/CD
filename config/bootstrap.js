/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {


  sails.config.http.locals.filters = ViewFilterService;
  _.extend(sails.hooks.http.app.locals, sails.config.http.locals);

  if (process.env.NODE_ENV !== 'development') {
    sails.hooks.http.app.set('trust proxy', true);
  }


  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  User.count().exec(function (err, count) {
    if (err) return cb(err);
    if (count == 0) {
      var user = {
        name: 'Admin',
        // email: 'admin@cd.com',
        // password: 'CommercialDirect1',
        email: 'znorth@silverhillfunding.com',
        password: 'Solve321@',
        status: 'Active',
        type: 'admin',
        role: 'editor'
      };
      User.create(user).exec(function (err, users) {
        cb();
      });
    } else {
      cb();
    }
  });

};
