
/**
 * Created by zeeshan on 3/1/2017.
 */
module.exports = {

  create: function (params) {
    return EndUser.create(params).then(function (user) {
      return user;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(EndUser, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  createOrFind: function (params) {
    return EndUser.findOne({email: params.email}).then(function (user) {
      if (user) {
        return {isFound: true, user: user};
      }
      params['password'] = Math.random().toString(36).slice(2);
      return EndUser.create(params);
    }).then(function (response) {
      if (response.isFound) {
        return response.user;
      }
      return EmailService.sendWelcomeEmail(response);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(EndUser, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },


  update: function (id, params) {
    return EndUser.update({id: id}, params).then(function (updatedUsers) {
      return updatedUsers[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(EndUser, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  createOrUpdate: function (params) {
    var _this = this;
    if(params.id) {
      return _this.update(params.id, params);
    }
    else {
      return _this.create(params);
    }  
  },


  findByEmail: function (email) {
    return EndUser.findOne({email: email});
  },

  findById: function (id) {
    return EndUser.findOne({id: id});
  }

};
