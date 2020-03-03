/**
 * WhitelistedIPController
 *
 * @description :: Server-side logic for managing whitelisted ip
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;
    WhitelistedIPService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/whitelistedip/list', {
        layout: 'adminaccess/layout',
        title: 'Whitelisted IP',
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount,
        whitelistedIPs: response.ips,
        error: error
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
    return res.view('adminaccess/whitelistedip/create', {
      layout: 'adminaccess/layout',
      title: 'Whitelisted IP',
      whitelistedIP: {},
      error: {}
    })
  },

  create: function (req, res) {
    var reqIP = req.allParams();
    WhitelistedIPService.create(reqIP).then(function (response) {
      return res.redirect('adminaccess/whitelistedips');
    }).catch(function (err) {
      return res.view('adminaccess/whitelistedip/create', {
        layout: 'adminaccess/layout',
        title: 'Whitelisted IP',
        whitelistedIP: reqIP,
        error: err
      })
    })
  },

  delete: function (req, res, next) {
    var _this = this;
    var search = req.param('search');
    var id = req.param('id');
    WhitelistedIPService.delete(id).then(function (deletedIP) {
      var redirectUrl = "adminaccess/whitelistedips";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: "Unable to Delete IP"};
      _this._renderList(res, error, next, search);
    })
  }


};

