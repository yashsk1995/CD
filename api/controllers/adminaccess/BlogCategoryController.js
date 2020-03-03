/**
 * BlogCategoryController
 *
 * @description :: Server-side logic for managing blog categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;
    BlogCategoryService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/blogcategory/list', {
        layout: 'adminaccess/layout',
        title: 'Blog Category',
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount,
        blogCategories: response.blogCategories,
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
    return res.view('adminaccess/blogcategory/create', {
      layout: 'adminaccess/layout',
      title: 'Blog Category',
      blogCategory: {},
      error: {}
    })
  },

  create: function (req, res) {
    var reqCategory = req.allParams();
    BlogCategoryService.create(reqCategory).then(function (response) {
      return res.redirect('adminaccess/blogcategories');
    }).catch(function (err) {
      return res.view('adminaccess/blogcategory/create', {
        layout: 'adminaccess/layout',
        title: 'Blog Category',
        blogCategory: reqCategory,
        error: err
      })
    })
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    BlogCategoryService.findById(id).then(function (blogCategory) {
      return res.view('adminaccess/blogcategory/edit', {
        layout: 'adminaccess/layout',
        title: 'Blog Category',
        blogCategory: blogCategory,
        error: {}
      })
    }).catch(function (err) {
      var error = {message: "Unable to find Blog Category"};
      _this._renderList(res, error, next);
    });

  },

  edit: function (req, res) {
    var id = req.param('id');
    var reqCategory = req.allParams();
    BlogCategoryService.update(id, reqCategory).then(function (category) {
      return res.redirect('adminaccess/blogcategories');
    }).catch(function (err) {
      return res.view('adminaccess/blogcategory/edit', {
        layout: 'adminaccess/layout',
        title: 'Blog Category',
        blogCategory: reqCategory,
        error: err
      })
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var search = req.param('search');
    var id = req.param('id');
    BlogCategoryService.delete(id).then(function (category) {
      var redirectUrl = "adminaccess/blogcategories";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: "Unable to Delete Blog Category"};
      _this._renderList(res, error, next, search);
    })
  }
};

