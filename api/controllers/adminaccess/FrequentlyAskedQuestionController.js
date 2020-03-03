/**
 * FrequentlyAskedQuestionController
 *
 * @description :: Server-side logic for managing frequently asked questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;

    FrequentlyAskedQuestionService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/faq/list', {
        layout: 'adminaccess/layout',
        title: 'FAQ',
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount,
        faqs: response.faqs,
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
    return res.view('adminaccess/faq/create', {layout: 'adminaccess/layout', title: 'FAQ', faq: {}, error: {}});
  }
  ,

  create: function (req, res) {
    var reqFaq = req.allParams();
    FrequentlyAskedQuestionService.create(reqFaq).then(function (response) {
      return res.redirect('adminaccess/faqs');
    }).catch(function (err) {
      return res.view('adminaccess/faq/create', {layout: 'adminaccess/layout', title: 'FAQ', faq: reqFaq, error: err})
    });
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    FrequentlyAskedQuestionService.findById(id).then(function (faq) {
      return res.view('adminaccess/faq/edit', {layout: 'adminaccess/layout', title: 'FAQ', faq: faq, error: {}})
    }).catch(function (err) {
      var error = {message: 'Unable to Edit FAQ'};
      _this._renderList(res, error, next);
    });
  },

  edit: function (req, res) {
    var reqFaq = req.allParams();
    var id = req.param('id');

    FrequentlyAskedQuestionService.update(req.param('id'), reqFaq).then(function (response) {
      return res.redirect('adminaccess/faqs');
    }).catch(function (err) {
      return res.view('adminaccess/faq/edit', {layout: 'adminaccess/layout', title: 'FAQ', faq: reqFaq, error: err})
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    var page = req.param('page');
    FrequentlyAskedQuestionService.publish(id).then(function (response) {
      var redirectUrl = "adminaccess/faqs";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: 'Unable to Publish FAQ'};
      _this._renderList(res, error, next, search, page);
    });
  },


  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    var page = req.param('page');
    FrequentlyAskedQuestionService.draft(id).then(function (response) {
      var redirectUrl = "adminaccess/faqs";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: 'Unable to Publish FAQ'};
      _this._renderList(res, error, next, search, page);
    });
  },

  delete: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    var search = req.param('search');
    var page = req.param('page');
    FrequentlyAskedQuestionService.delete(id).then(function (response) {
      var redirectUrl = "adminaccess/faqs";
      if (search) redirectUrl += "?search=" + search;
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: 'Unable to Delete FAQ'};
      _this._renderList(res, error, next, search, page);
    });
  }
};

