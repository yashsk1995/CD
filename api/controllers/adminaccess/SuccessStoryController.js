/**
 * SuccessStoryController
 *
 * @description :: Server-side logic for managing success stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;

    SuccessStoryService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/successstory/list', {
        layout: 'adminaccess/layout',
        title: 'Showcase',
        successStories: response.successStories,
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
    return res.view('adminaccess/successstory/create', {
      layout: 'adminaccess/layout', title: 'Showcase',
      successStory: {}, error: {}
    });
  },

  create: function (req, res) {

    var reqSuccessStory = req.allParams();
    var previewImage = req.file('previewImage');

    FileUploadService.uploadToS3(previewImage, '').then(function (filePath) {
      reqSuccessStory['previewImageUrl'] = filePath;
      return SuccessStoryService.create(reqSuccessStory);
    }).then(function (response) {
      return res.redirect('adminaccess/successstories');
    }).catch(function (error) {
      return res.view('adminaccess/successstory/create', {
        layout: 'adminaccess/layout',
        title: 'Showcase',
        successStory: reqSuccessStory,
        error: error
      });
    });

  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    SuccessStoryService.findById(id).then(function (successStory) {
      if (successStory) {
        return res.view('adminaccess/successstory/edit', {
          layout: 'adminaccess/layout',
          title: 'Showcase',
          successStory: successStory,
          error: {}
        });
      }
      var error = {message: 'Unable to edit Story'};
      _this._renderList(res, error, next);
    }).catch(function (err) {
      var error = {message: 'Unable to edit Story'};
      _this._renderList(res, error, next);
    });
  },

  edit: function (req, res) {
    var id = req.param('id');
    var reqSuccessStory = req.allParams();
    var previewImage = req.file('previewImage');

    FileUploadService.uploadToS3(previewImage, reqSuccessStory.previewImageUrl).then(function (filePath) {
      reqSuccessStory['previewImageUrl'] = filePath;
      return SuccessStoryService.update(id, reqSuccessStory);
    }).then(function (response) {
      return res.redirect('adminaccess/successstories');
    }).catch(function (error) {
      return res.view('adminaccess/successstory/edit', {
        layout: 'adminaccess/layout',
        title: 'Showcase',
        successStory: reqSuccessStory,
        error: error
      });
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    SuccessStoryService.publish(id).then(function (response) {
      var redirectUrl = "adminaccess/successstories";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      error = {message: 'Unable to Publish Story'};
      _this._renderList(res, error, next, search);
    });
  },

  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    SuccessStoryService.draft(id).then(function (response) {
      var redirectUrl = "adminaccess/successstories";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      error = {message: 'Unable to Publish Story'};
      _this._renderList(res, error, next, search);
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');

    SuccessStoryService.delete(id).then(function (response) {
      var redirectUrl = "adminaccess/successstories";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      error = {message: 'Unable to Delete Story'};
      _this._renderList(res, error, next, search);
    });
  }
}
;

