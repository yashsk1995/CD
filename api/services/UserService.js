/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, userType) {
    var criteria = {
      where: {
        name: {'contains': search}
      }
    };

    if (userType) {
      criteria.where['type'] = userType;
    }

    var countQuery = User.count(criteria);

    var findQuery = User.find(criteria);

    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        users: response[1]
      };
    });
  },

  //Still a callback because passport js uses callback
  updateLoginInfo: function (user, ip, cb) {
    User.update({id: user.id}, {lastLoginIP: ip, lastLoginTime: new Date()})
      .exec(function updated(err, users) {
        if (err) return cb(err);
        if (users.length > 0) {
          cb(err, users[0].toJSON());
        } else {
          cb(err, err);
        }
      });
  },

  findById: function (id) {
    return User.findOne({id: id}).then(function (user) {
      if (user) {
        return user;
      }
      throw {message: 'User Not Found'};
    });
  },

  findByEndUser: function (endUserId) {
    return User.findOne({endUser: endUserId}).then(function (user) {
      if (user) {
        return user;
      }
      throw {message: 'User Not Found'};
    });
  },

  findByEmail: function (email, isPopulateEndUser) {
    var findQuery = User.findOne({email: email});
    if(isPopulateEndUser) findQuery.populate('endUser');
    return findQuery;
  },

  create: function (params) {
    return User.create(params).then(function (user) {
      return user;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(User, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },

  update: function (id, params) {
    return User.update({id: id}, params).then(function (updatedUsers) {
      return updatedUsers[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(User, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },

  active: function (id) {
    var params = {status: sails.config.app_constants.user_status.active};
    return this.update(id, params);
  },

  delete: function (id) {
    var params = {status: sails.config.app_constants.user_status.deleted};
    return this.update(id, params);
  },

  createNew: function (params) {
    return NewUser.create(params).then(function (user) {
      return user;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(User, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },

  updateNew: function (cond, params) {
    return NewUser.update(cond, params).then(function (updatedUsers) {
      return updatedUsers[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(User, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },
};
