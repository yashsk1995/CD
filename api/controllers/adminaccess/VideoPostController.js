/**
 * VideoPostController
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

    VideoPostService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/videopost/list', {
        layout: 'adminaccess/layout',
        title: 'Video Post',
        videoPosts: response.posts,
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
    VideoCategoryService.list('', '').then(function (response) {
      return res.view(view, {
        layout: 'adminaccess/layout',
        title: 'Video Post',
        videoCategories: response.videoCategories,
        videoPost: blogPost,
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
    this._renderView(res, 'adminaccess/videopost/create', {}, {}, next);
  },

  create: function (req, res) {
    var _this = this;
    var reqBlogPost = req.allParams();
    console.log(reqBlogPost)
    var previewImage = req.file('previewImage');
    Promise.all([FileUploadService.uploadToS3(previewImage, '')]).then(function (response) {
      reqBlogPost['previewImageUrl'] = response[0];
      return VideoPostService.create(reqBlogPost);
    }).then(function (newBlogPost) {
      return res.redirect('adminaccess/videoposts');
    }).catch(function (err) {
      return _this._renderView(res, 'adminaccess/videopost/create', reqBlogPost, err);
    });
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    VideoPostService.findById(id).then(function (blogPost) {
      _this._renderView(res, 'adminaccess/videopost/edit', blogPost, {}, next);
    }).catch(function (error) {
      error = {message: "Unable to edit Blog Post"};
      _this._renderList(res, error, next);
    });
  },

  edit: function (req, res, next) {
    console.log("FOr edit")
    var _this = this;
    var id = req.param('id');
    var reqBlogPost = req.allParams();
    var previewImage = req.file('previewImage');
    Promise.all([
      FileUploadService.uploadToS3(previewImage, reqBlogPost.previewImageUrl)
    ]).then(function (response) {
      reqBlogPost['previewImageUrl'] = response[0];
      return VideoPostService.update(id, reqBlogPost);
    }).then(function (updatedBlogPost) {
      return res.redirect('adminaccess/videoposts');
    }).catch(function (err) {
      return _this._renderView(res, 'adminaccess/videopost/edit', reqBlogPost, err)
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    VideoPostService.publish(id).then(function (response) {
      var redirectUrl = "adminaccess/videoposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Publish Video Post"};
      _this._renderList(res, err, next, search);
    });
  },

  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    VideoPostService.draft(id).then(function (response) {
      var redirectUrl = "adminaccess/videoposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Publish Video Post"};
      _this._renderList(res, err, next, search);
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var ids = req.param('id');
    var search = req.param('search');
    VideoPostService.delete(ids).then(function (response) {
      var redirectUrl = "adminaccess/videoposts";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      err = {message: "Unable to Delete Video Post"};
      _this._renderList(res, err, next, search);
    });
  }
};

