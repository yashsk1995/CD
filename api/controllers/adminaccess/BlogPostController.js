/**
 * BlogPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;

    BlogPostService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/blogpost/list', {
        layout: 'adminaccess/layout',
        title: 'Blog Post',
        blogPosts: response.posts,
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

  _renderView: function (res, view, blogPost, error, next) {
    BlogCategoryService.list('', '').then(function (response) {
      return res.view(view, {
        layout: 'adminaccess/layout',
        title: 'Blog Post',
        blogCategories: response.blogCategories,
        blogPost: blogPost,
        error: error
      });
    }).catch(function (err) {
      next(err);
    });
  },


  list: function (req, res, next) {
    var search = req.param('search');
    var sort = req.param('sort');
    var page = req.param('page');
    this._renderList(res, {}, next, search, sort, page);
  },

  renderCreate: function (req, res, next) {
    this._renderView(res, 'adminaccess/blogpost/create', {}, {}, next);
  },

  create: function (req, res) {
    var _this = this;
    var reqBlogPost = req.allParams();
    var previewImage = req.file('previewImage');
    var headerImage = req.file('headerImage');
    Promise.all([FileUploadService.uploadToS3(previewImage, ''), FileUploadService.uploadToS3(headerImage, '')]).then(function (response) {
      reqBlogPost['previewImageUrl'] = response[0];
      reqBlogPost['headerImageUrl'] = response[1];
      return BlogPostService.create(reqBlogPost);
    }).then(function (newBlogPost) {
      return res.redirect('adminaccess/blogposts');
    }).catch(function (err) {
      return _this._renderView(res, 'adminaccess/blogpost/create', reqBlogPost, err);
    });
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    BlogPostService.findById(id).then(function (blogPost) {
      _this._renderView(res, 'adminaccess/blogpost/edit', blogPost, {}, next);
    }).catch(function (error) {
      error = {message: "Unable to edit Blog Post"};
      _this._renderList(res, error, next);
    });
  },

  edit: function (req, res) {
    var _this = this;
    var id = req.param('id');
    var reqBlogPost = req.allParams();
    var previewImage = req.file('previewImage');
    var headerImage = req.file('headerImage');

    Promise.all([
      FileUploadService.uploadToS3(previewImage, reqBlogPost.previewImageUrl),
      FileUploadService.uploadToS3(headerImage, reqBlogPost.headerImageUrl)
    ]).then(function (response) {
      reqBlogPost['previewImageUrl'] = response[0];
      reqBlogPost['headerImageUrl'] = response[1];
      return BlogPostService.update(id, reqBlogPost);
    }).then(function (updatedBlogPost) {
      return res.redirect('adminaccess/blogposts');
    }).catch(function (err) {
      return _this._renderView(res, 'adminaccess/blogpost/edit', reqBlogPost, err)
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    BlogPostService.publish(id).then(function (response) {
      var redirectUrl = "adminaccess/blogposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Publish Blog Post"};
      _this._renderList(res, err, next, search);
    });
  },

  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    BlogPostService.draft(id).then(function (response) {
      var redirectUrl = "adminaccess/blogposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Publish Blog Post"};
      _this._renderList(res, err, next, search);
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var ids = req.param('id');
    var search = req.param('search');
    BlogPostService.delete(ids).then(function (response) {
      var redirectUrl = "adminaccess/blogposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Delete Blog Post"};
      _this._renderList(res, err, next, search);
    });
  }
};

