/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPopulateArticles, articleIds) {
    var criteria = {
      where: {
        name: {'contains': search}
      }
    };

    var countQuery = KnowledgeBaseTopic.count(criteria);

    var findQuery = KnowledgeBaseTopic.find(criteria);

    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});

    var articleCriteria = {status: sails.config.app_constants.doc_status.published}
    if (articleIds) {
      articleCriteria['id'] = articleIds;
    }

    if (isPopulateArticles) findQuery.populate('articles', articleCriteria);
    findQuery.populate('author');
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        topics: response[1]
      }
    });
  },

  create: function (params) {
    return KnowledgeBaseTopic.create(params).then(function (topic) {
      return topic;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(KnowledgeBaseTopic, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details}
    });
  },

  findById: function (id) {
    return KnowledgeBaseTopic.findOne({id: id});
  },

  update: function (id, params) {
    return KnowledgeBaseTopic.update({id: id}, params).then(function (topics) {
      return topics;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(KnowledgeBaseTopic, err.ValidationError)
        throw handledError;
      }
    });
  },

  findBySlug: function (slug) {
    var name = ViewFilterService.urlDecode(slug).toLowerCase();
    console.log("Slug ", name);
    return KnowledgeBaseTopic.findOne({
      name: name
    }).then(function (topic) {
      if (topic) return topic;
      throw({message: 'Topic not found'});
    });
  },

  delete: function (id) {
    return KnowledgeBaseTopic.destroy({id: id}).then(function (topic) {
      return topic;
    }).catch(function (err) {
      throw { message: err.details };
    });
  }
};
