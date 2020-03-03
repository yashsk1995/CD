/**
 * KnowledgeBaseTopicController
 *
 * @description :: Server-side logic for managing knowledge base topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  _renderList: function (res, error, next, search, sort, page) {
    search = search || '';
    sort = sort || '';
    page = page || 1;
    var limit = 5;
    KnowledgeBaseTopicService.list(search, sort, page, limit).then(function (response) {
      return res.view('adminaccess/knowledgebasetopic/list', {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Topic',
        search: search,
        sort: sort,
        currentPage: page,
        pageCount: response.pageCount,
        topics: response.topics,
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
    return res.view('adminaccess/knowledgebasetopic/create', {
      layout: 'adminaccess/layout',
      title: 'Knowledge Base Topic',
      topic: {},
      error: {}
    })
  },

  create: function (req, res) {
    var reqTopic = req.allParams();
   // reqTopic.slug = reqTopic.name.split(" ").join("-");
    KnowledgeBaseTopicService.create(reqTopic).then(function (newTopic) {
      return res.redirect('adminaccess/knowledgebasetopics');
    }).catch(function (err) {
      return res.view('adminaccess/knowledgebasetopic/create', {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Topic',
        topic: reqTopic,
        error: err
      })
    })
  },

  renderEdit: function (req, res) {
    var id = req.param('id');
    KnowledgeBaseTopicService.findById(id).then(function (topic) {
      return res.view('adminaccess/knowledgebasetopic/edit', {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Topic',
        topic: topic,
        error: {}
      })
    }).catch(function (error) {
      return res.redirect('adminaccess/knowledgebasetopics');
    });

  },

  edit: function (req, res) {
    var reqTopic = req.allParams();
    var id = req.param('id');
    //reqTopic.slug = reqTopic.name.split(" ").join("-");
    KnowledgeBaseTopicService.update(id, reqTopic).then(function (topic) {
      return res.redirect('adminaccess/knowledgebasetopics');
    }).catch(function (err) {
      return res.view('adminaccess/knowledgebasetopic/edit', {
        layout: 'adminaccess/layout',
        title: 'Knowledge Base Topic',
        topic: reqTopic,
        error: err
      });
    });
  },

  delete: function (req, res) {
    var _this = this;
    var search = req.param('search');
    var id = req.param('id');
    KnowledgeBaseTopicService.delete(id).then(function (topic) {
      var redirectUrl = "adminaccess/knowledgebasetopics";
      if (search) {
        redirectUrl += "?search=" + search;
      }
      return res.redirect(redirectUrl);
    }).catch(function (err) {
      var error = {message: "Unable to Knowledge Base Topic"};
      _this._renderList(res, error, next, search);
    });
  }
};

