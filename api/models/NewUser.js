/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    first_name: {
      type: 'string',
    },

    last_name: {
      type: 'string',
    },

    phone: {
      type: 'string',
    },

    email: {
      type: 'email',
      unique: true
    },

    company_name: {
      type: 'string',
    },

    state: {
      type: 'string',
    },

    job: {
      type: 'string',
    },

    // user_name: {
    //   type: 'string',
    // },

    password: {
      type: 'string',
    },

    reset: {
      type: 'string'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  validationMessages: {
    name: {
      required: 'Name is required'
    },
    email: {
      email: 'Please enter valid email',
      required: 'Email is required',
      unique: 'Email already taken'
    },
    password: {
      required: 'Password is required'
    }
  },

  beforeCreate: function (user, cb) {
    CryptoService.encryptPassword(user, cb);
  },

  beforeUpdate: function (user, cb) {
    if (user.password) {
      return CryptoService.encryptPassword(user, cb);
    }
    delete user.password;
    return cb(false, user);
  },
};

