/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPublished) {
    var criteria = {
      where: {
        or: [
          {question: {'contains': search}}
        ]
      }
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    var countQuery = FrequentlyAskedQuestion.count(criteria);

    var findQuery = FrequentlyAskedQuestion.find(criteria);
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});
    findQuery.populate('author');
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        faqs: response[1]
      }
    });
  },

  create: function (params) {
    return FrequentlyAskedQuestion.create(params).then(function (faq) {
      return faq;
    }).then(function (faq) {
      return ElasticSearchService.index(faq, sails.config.app_constants.es_types.faq);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(FrequentlyAskedQuestion, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  findById: function (id) {
    return FrequentlyAskedQuestion.findOne({id: id});
  },

  update: function (id, params) {
    return FrequentlyAskedQuestion.update({id: id}, params).then(function (faqs) {
      if (faqs.length > 0) {
        return faqs;
      }
      throw {message: 'FAQ not found'};
    }).then(function (faqs) {
      var promiseArr = [];
      faqs.forEach(function (faq) {
        promiseArr.push(ElasticSearchService.index(faq, sails.config.app_constants.es_types.faq));
      });
      return promiseArr;
    }).then(function (promiseArr) {
      return Promise.all(promiseArr);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(FrequentlyAskedQuestion, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
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

  createFeedback: function (helpful, faqId) {
    var params = {helpful: helpful, faq: faqId};
    return FrequentlyAskedQuestionFeedback.create(params).then(function (feedback) {
      return feedback;
    });
  }

};
