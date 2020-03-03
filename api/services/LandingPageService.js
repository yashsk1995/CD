/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPublished) {

    var criteria = {
      where: {
        or: [
          {title: {'contains': search}},
          {slug: {'contains': search}}
        ]
      }
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    var countQuery = LandingPage.count(criteria);

    var findQuery = LandingPage.find(criteria);
    findQuery.populate('author');
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});

    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        landingPages: response[1]
      }
    });
  },

  create: function (params) {
    return LandingPage.create(params).then(function (landingPage) {
      return landingPage;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(LandingPage, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details}
    });
  },

  findById: function (id) {
    return LandingPage.findOne({id: id});
  },

  findBySlug: function (slug) {
    return LandingPage.findOne({
      slug: slug,
      status: sails.config.app_constants.doc_status.published
    }).then(function (landingPage) {
      if (landingPage) return landingPage;
      throw({message: 'Landing Page Not Found'});
    });
  },

  update: function (id, params) {
    return LandingPage.update({id: id}, params).then(function (landingPages) {
      if (landingPages.length > 0) {
        return landingPages;
      }
      throw {message: 'Unable to Update Landing Page'};
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(LandingPage, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details}
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
  }

};
