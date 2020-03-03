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
        VideoCategoryService.list(search, sort, page, limit).then(function (response) {
          return res.view('adminaccess/videocategory/list', {
            layout: 'adminaccess/layout',
            title: 'Video Category',
            search: search,
            sort: sort,
            currentPage: page,
            pageCount: response.pageCount,
            videoCategories: response.videoCategories,
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
        return res.view('adminaccess/videocategory/create', {
          layout: 'adminaccess/layout',
          title: 'Video Category',
          videoCategory: {},
          error: {}
        })
      },
    
      create: function (req, res) {
        var reqCategory = req.allParams();
        var previewImage = req.file('previewImage');
        var headerImage = req.file('headerImage');
        Promise.all([FileUploadService.uploadToS3(previewImage, ''), FileUploadService.uploadToS3(headerImage, '')]).then(function (response) {
            reqCategory['previewImageUrl'] = response[0];
            reqCategory['headerImageUrl'] = response[1];
            return VideoCategoryService.create(reqCategory);
        }).then(function (response) {
          return res.redirect('adminaccess/videocategories');
        }).catch(function (err) {
          return res.view('adminaccess/videocategory/create', {
            layout: 'adminaccess/layout',
            title: 'Video Category',
            videoCategory: reqCategory,
            error: err
          })
        })
      },
    
      renderEdit: function (req, res, next) {
        var _this = this;
        var id = req.param('id');
        VideoCategoryService.findById(id).then(function (videoCategory) {
          return res.view('adminaccess/videocategory/edit', {
            layout: 'adminaccess/layout',
            title: 'Video Category',
            videoCategory: videoCategory,
            error: {},
          })
        }).catch(function (err) {
          var error = {message: "Unable to find Video Category"};
          _this._renderList(res, error, next);
        });
    
      },
    
      edit: function (req, res) {
        console.log("Request recieve")
        var id = req.param('id');
        var reqCategory = req.allParams();
        var previewImage = req.file('previewImage');
        var headerImage = req.file('headerImage');
        Promise.all([FileUploadService.uploadToS3(previewImage, reqCategory['previewImageUrl']), FileUploadService.uploadToS3(headerImage, reqCategory['headerImageUrl'])]).then(function (response) {
            reqCategory['previewImageUrl'] = response[0];
            reqCategory['headerImageUrl'] = response[1];
            return VideoCategoryService.update(id, reqCategory);
        }).then(function (category) {
          return res.redirect('adminaccess/videocategories');
        }).catch(function (err) {
          return res.view('adminaccess/videocategory/edit/', {
            layout: 'adminaccess/layout',
            title: 'Video Category',
            videoCategory: reqCategory,
            error: err
          })
        });
      },
    
      delete: function (req, res, next) {
        var _this = this;
        var search = req.param('search');
        var id = req.param('id');
        VideoCategoryService.delete(id).then(function (category) {
          var redirectUrl = "adminaccess/videocategories";
          if (search) redirectUrl += "?search=" + search;
          return res.redirect(redirectUrl);
        }).catch(function (err) {
          var error = {message: "Unable to Delete Video Category"};
          _this._renderList(res, error, next, search);
        })
      }
    };
    
    