/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;
    var userType = sails.config.app_constants.user_types.admin;
    UserService.list(search, sort, page, limit, userType).then(function (response) {
      return res.view('adminaccess/user/list', {
        layout: 'adminaccess/layout',
        title: 'User',
        users: response.users,
        error: error,
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount
      });
    }).catch(function (err) {
      return next(err);
    });
  },

  list: function (req, res, next) {
    var search = req.param('search');
    var sort = req.param('sort');
    var page = req.param('page');
    this._renderList(res, {}, next, search, sort, page);
  },

  renderCreate: function (req, res) {
    return res.view('adminaccess/user/create', {layout: 'adminaccess/layout', title: 'User', user: {}, error: {}})
  },

  create: function (req, res) {
    var newUser = req.allParams();
    newUser['type'] = sails.config.app_constants.user_types.admin;
    newUser['role'] = sails.config.app_constants.user_roles.editor;
    UserService.create(newUser).then(function (users) {
      return res.redirect('adminaccess/users');
    }).catch(function (error) {
      return res.view('adminaccess/user/create', {
        layout: 'adminaccess/layout',
        title: 'User',
        user: newUser,
        error: error
      });
    });
  },


  renderEdit: function (req, res) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');

    UserService.findById(id).then(function (user) {
      return res.view('adminaccess/user/edit', {layout: 'adminaccess/layout', user: user, error: {}})
    }).catch(function (error) {
      return _this._renderList(res, error, next, search);
    });
  },

  edit: function (req, res) {
    var user = req.allParams();
    if (user.password == '') {
      delete user.password;
    }
    UserService.update(req.param('id'), user).then(function (updatedUser) {
      return res.redirect('adminaccess/users');
    }).catch(function (error) {
      return res.view('adminaccess/user/edit', {
        layout: 'adminaccess/layout',
        title: 'User',
        user: user, error: error
      });
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var ids = req.param('id');
    var search = req.param('search');
    UserService.delete(ids).then(function (updatedUser) {
      var redirectUrl = "adminaccess/users";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      return _this._renderList(res, error, next, search);
    });
  },

  active: function (req, res, next) {
    var _this = this;
    var ids = req.param('id');
    var search = req.param('search');
    UserService.active(ids).then(function (updatedUser) {
      var redirectUrl = "adminaccess/users";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      return _this._renderList(res, error, next, search);
    });
  },

};

