/**
 * KnowledgeBaseArticleController
 *
 * @description :: Server-side logic for managing knowledge base articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;
    KnowledgeBaseArticleService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/knowledgebasearticle/list', {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Article',
        articles: response.articles,
        error: error,
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount
      });
    }).catch(function (error) {
      return next(error);
    });
  },

  _renderView: function (res, view, article, error) {
    KnowledgeBaseTopicService.list('', '').then(function (response) {
      return res.view(view, {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Article',
        topics: response.topics,
        article: article,
        error: error
      });
    });
  },

  list: function (req, res, next) {
    var search = req.param('search');
    var sort = req.param('sort');
    var pageNo = req.param('page');
    this._renderList(res, {}, next, search, sort, pageNo);
  },


  renderCreate: function (req, res) {
    this._renderView(res, 'adminaccess/knowledgebasearticle/create', {}, {});
  },

  create: function (req, res) {
    var _this = this;
    var reqArticle = req.allParams();
    //reqArticle.slug = reqArticle.term.split(" ").join("-");
    KnowledgeBaseArticleService.create(reqArticle).then(function (response) {
      return res.redirect('adminaccess/knowledgebasearticles');
    }).catch(function (error) {
      _this._renderView(res, 'adminaccess/knowledgebasearticle/create', reqArticle, error);
    });
  },

  renderEdit: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    KnowledgeBaseArticleService.findById(id).then(function (article) {
      _this._renderView(res, 'adminaccess/knowledgebasearticle/edit', article, {});
    }).catch(function (error) {
      _this._renderList(res, error, next);
    });
  },

  edit: function (req, res) {
    var _this = this;
    var id = req.param('id');
    var reqArticle = req.allParams();
    //reqArticle.slug = reqArticle.term.split(" ").join("-");
    KnowledgeBaseArticleService.update(id, reqArticle).then(function (articles) {
      return res.redirect('adminaccess/knowledgebasearticles');
    }).catch(function (error) {
      _this._renderView(res, 'adminaccess/knowledgebasearticle/edit', reqArticle, error);
    });
  },

  publish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    KnowledgeBaseArticleService.publish(id).then(function (response) {
      return res.redirect('adminaccess/knowledgebasearticles');
    }).catch(function (error) {
      _this._renderList(res, {message: 'Unable to Publish Article'}, next);
    });
  },

  unPublish: function (req, res, next) {
    var _this = this;
    var id = req.param('id');
    KnowledgeBaseArticleService.draft(id).then(function (response) {
      return res.redirect('adminaccess/knowledgebasearticles');
    }).catch(function (error) {
      _this._renderList(res, {message: 'Unable to Publish Article'}, next);
    });
  },

  delete: function (req, res) {
    var id = req.param('id');
    KnowledgeBaseArticleService.delete(id).then(function (response) {
      return res.redirect('adminaccess/knowledgebasearticles');
    }).catch(function (error) {
      _this._renderList(res, {message: 'Unable to Publish Article'}, next);
    });

  }
};

