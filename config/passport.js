var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id } , function (err, user) {
    if(user){
      done(err, user);
    }else{
      done(err, false);
    }

  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {

    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      if(bcrypt.compareSync(password, user.password)){
        return done(null, user.toJSON(), {
          message: 'Logged In Successfully'
        });
      }else{
        return done(null, false, {
          message: 'Invalid Password'
        });
      }

    });
  }
));
