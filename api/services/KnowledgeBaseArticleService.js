/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPublished) {

    var criteria = {
      where: {
        or: [
          {term: {'contains': search}}
        ]
      }
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    var countQuery = KnowledgeBaseArticle.count(criteria);

    var findQuery = KnowledgeBaseArticle.find(criteria);
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});
    findQuery.populate('topic');
    findQuery.populate('author');
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        articles: response[1]
      }
    })

  },


  listRelated: function (currentId, topicId) {
    var findQuery = KnowledgeBaseArticle.find();
    findQuery.where({id: {'!': currentId}});
    findQuery.where({status: sails.config.app_constants.doc_status.published});
    findQuery.where({topic: topicId});
    findQuery.limit(6);
    return findQuery.then(function (articles) {
      return articles;
    });
  },

  listbyTopic: function (topicId) {
    var findQuery = KnowledgeBaseArticle.find();
    findQuery.where({status: sails.config.app_constants.doc_status.published});
    findQuery.where({topic: topicId});
    findQuery.populate('topic');
    findQuery.populate('author');
    return findQuery.then(function (articles) {
      return articles;
    });
  },

  create: function (params) {
    return KnowledgeBaseArticle.create(params).populate('topic').then(function (article) {
      return KnowledgeBaseArticle.findOne({id: article.id}).populate('topic');
    }).then(function (article) {
      return ElasticSearchService.index(article, sails.config.app_constants.es_types.knowledge);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(KnowledgeBaseArticle, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  findById: function (id) {
    return KnowledgeBaseArticle.findOne({id: id}).then(function (article) {
      if (article) return article;
      throw {message: 'Article not found'};
    });
  },


  findPublishedById: function (id) {
    return KnowledgeBaseArticle.findOne({
      id: id,
      status: sails.config.app_constants.doc_status.published
    }).then(function (article) {
      if (article) return article;
      throw {message: 'Article not found'};
    });
  },

  update: function (id, params) {
    return KnowledgeBaseArticle.update({id: id}, params).then(function (articles) {
      if (articles.length > 0) {
        return articles;
      }
      throw {message: 'Article not found'};
    }).then(function (articles) {
      var ids = articles.map(function (ar) {
        return ar.id;
      });
      return KnowledgeBaseArticle.find({id: ids}).populate('topic');
    }).then(function (articles) {
      var promiseArr = [];
      articles.forEach(function (article) {
        promiseArr.push(ElasticSearchService.index(article, sails.config.app_constants.es_types.knowledge));
      });
      return promiseArr;
    }).then(function (promiseArr) {
      return Promise.all(promiseArr);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(KnowledgeBaseArticle, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  publish: function (id) {
    var params = {status: sails.config.app_constants.doc_status.published, publishedAt: new Date()};
    return this.update(id, params);
  },

  draft: function (id) {
    var params = {status: sails.config.app_constants.doc_status.draft};
    return this.update(id, params);
  },

  delete: function (id) {
    var params = {status: sails.config.app_constants.doc_status.deleted};
    return this.update(id, params);
  },

  createFeedback: function (helpful, articleId) {
    var params = {helpful: helpful, article: articleId};
    return KnowledgeBaseArticleFeedback.create(params).then(function (feedback) {
      return feedback;
    });
  },

  findBySlug: function (slug) {
    var name = ViewFilterService.urlDecode(slug).toLowerCase();
    console.log("Slug ", name);
    return KnowledgeBaseArticle.findOne({
      term: name,
      status: sails.config.app_constants.doc_status.published
    }).then(function (article) {
      if (article) return article;
      throw({message: 'Article not found'});
    });
  },

};
