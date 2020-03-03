/**
 * LandingPageController
 *
 * @description :: Server-side logic for managing landing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;

    LandingPageService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/landingpage/list', {
        layout: 'adminaccess/layout',
        title: 'Landing Page',
        landingPages: response.landingPages,
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
    return res.view('adminaccess/landingpage/create', {
      layout: 'adminaccess/layout',
      title: 'Landing Page',
      landingPage: {},
      error: {}
    });
  },

  create: function (req, res) {
    var reqLandingPage = req.allParams();
    var headerImage = req.file('headerImage');
    var localPhoto = req.file('localPhoto');
    var fileToUpload = req.file('file');
    Promise.all([FileUploadService.uploadToS3(headerImage, ''), FileUploadService.uploadToS3(localPhoto, ''), FileUploadService.uploadToS3(fileToUpload, '')]).then(function (response) {
      console.log(response[2])
      reqLandingPage['headerImageUrl'] = response[0];
      reqLandingPage['localPhotoUrl'] = response[1];
      reqLandingPage['fileUrl'] = response[2];
      return LandingPageService.create(reqLandingPage);
    }).then(function (newLandingPage) {
      return res.redirect('adminaccess/landingpages');
    }).catch(function (error) {
      return res.view('adminaccess/landingpage/create', {
        layout: 'adminaccess/layout',
        title: 'Landing Page',
        landingPage: reqLandingPage,
        error: error
      });
    });
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');

    LandingPageService.findById(id).then(function (landingPage) {
      return res.view('adminaccess/landingpage/edit', {
        layout: 'adminaccess/layout',
        title: 'Landing Page',
        landingPage: landingPage,
        error: {}
      });
    }).catch(function (err) {
      var error = {message: 'Unable to edit Landing Page'};
      _this._renderList(res, error, next)
    });
  },

  edit: function (req, res) {
    var id = req.param('id');
    var reqLandingPage = req.allParams();
    var headerImage = req.file('headerImage');
    var localPhoto = req.file('localPhoto');
    var fileToUpload = req.file('file');
    
    Promise.all([FileUploadService.uploadToS3(headerImage, reqLandingPage.headerImageUrl),
      FileUploadService.uploadToS3(localPhoto, reqLandingPage.localPhotoUrl), 
      FileUploadService.uploadToS3(fileToUpload, reqLandingPage.fileUrl)]).then(function (response) {
        console.log(response[2])
      reqLandingPage['headerImageUrl'] = response[0];
      reqLandingPage['localPhotoUrl'] = response[1];
      reqLandingPage['fileUrl'] = response[2]; 
      return LandingPageService.update(id, reqLandingPage);
    }).then(function (response) {
      return res.redirect('adminaccess/landingpages');
    }).catch(function (error) {
      return res.view('adminaccess/landingpage/edit', {
        layout: 'adminaccess/layout',
        title: 'Landing Page',
        landingPage: reqLandingPage,
        error: error
      });
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    LandingPageService.publish(id).then(function (response) {
      var redirectUrl = "adminaccess/landingpages";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      var error = {message: 'Unable to Publish Landing Page'};
      _this._renderList(res, error, next, search)
    });
  },

  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    LandingPageService.draft(id).then(function (response) {
      var redirectUrl = "adminaccess/landingpages";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      var error = {message: 'Unable to Publish Landing Page'};
      _this._renderList(res, error, next, search)
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');

    LandingPageService.delete(id).then(function (response) {
      var redirectUrl = "adminaccess/landingpages";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (error) {
      var error = {message: 'Unable to Delete Landing Page'};
      _this._renderList(res, error, next, search)
    });
  }
};

