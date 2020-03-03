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

    var countQuery = SuccessStory.count(criteria);

    var findQuery = SuccessStory.find(criteria);
    findQuery.populate('author');
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});

    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        successStories: response[1]
      }
    });
  },

  create: function (params) {
    return SuccessStory.create(params).then(function (successStory) {
      return successStory;
    }).then(function (successStory) {
      return ElasticSearchService.index(successStory, sails.config.app_constants.es_types.successStory);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(SuccessStory, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details}
    });
  },

  findById: function (id) {
    return SuccessStory.findOne({id: id});
  },

  findPublishedById: function (id) {
    return SuccessStory.findOne({id: id, status: sails.config.app_constants.doc_status.published});
  },

  update: function (id, params) {
    return SuccessStory.update({id: id}, params).then(function (stories) {
      if (stories.length > 0) {
        return stories;
      }
      throw {message: 'Unable to Update Success Story'};
    }).then(function (stories) {
      var promiseArr = [];
      stories.forEach(function (story) {
        promiseArr.push(ElasticSearchService.index(story, sails.config.app_constants.es_types.successStory));
      });
      return promiseArr;
    }).then(function (promiseArr) {
      return Promise.all(promiseArr);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(SuccessStory, err.ValidationError);
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
  },

  listAllTags: function (tagType) {
    var tagTypes = ['purposeTags', 'propertyTypeTags', 'locationTags'];
    var findQuery = SuccessStory.find({select: tagTypes}, {where: {status: sails.config.app_constants.doc_status.published}});
    return findQuery.then(function (tags) {
      return tags;
    }).then(function (allTags) {
      var purposeTags = [];
      var propertyTypeTags = [];
      var locationTags = [];

      for (var i = 0; i < allTags.length; i++) {
        var pTags = allTags[i].purposeTags ? allTags[i].purposeTags.split(",") : '';
        var prTags = allTags[i].propertyTypeTags ? allTags[i].propertyTypeTags.split(",") : '';
        var lTags = allTags[i].locationTags ? allTags[i].locationTags.split(",") : '';
        for (var j = 0; j < pTags.length || j < prTags.length || j < lTags.length; j++) {
          if (pTags[j] && purposeTags.indexOf(pTags[j]) < 0) {
            purposeTags.push(pTags[j]);
          }

          if (prTags[j] && propertyTypeTags.indexOf(prTags[j]) < 0) {
            propertyTypeTags.push(prTags[j]);
          }

          if (lTags[j] && locationTags.indexOf(lTags[j]) < 0) {
            locationTags.push(lTags[j]);
          }
        }
      }
      return {
        purposeTags: purposeTags,
        propertyTypeTags: propertyTypeTags,
        locationTags: locationTags
      };

    });
  },


  listByTags: function (tags) {
    var criteria = [];
    if (typeof tags == "string") {
      criteria.push({purposeTags: {'contains': tags}});
      criteria.push({propertyTypeTags: {'contains': tags}});
      criteria.push({locationTags: {'contains': tags}});
    } else {
      tags.forEach(function (tag) {
        criteria.push(
          {purposeTags: {'contains': tag}}
        );
        criteria.push(
          {propertyTypeTags: {'contains': tag}}
        );
        criteria.push(
          {locationTags: {'contains': tag}}
        );
      });
    }

    var findQuery = SuccessStory.find({
      or: criteria
    });
    findQuery.where({status: sails.config.app_constants.doc_status.published})

    return findQuery.then(function (stories) {
      return stories;
    });
  },

  listOther: function (currentId) {
    var findQuery = SuccessStory.find();
    findQuery.where({id: {'!': currentId}});
    findQuery.where({status: sails.config.app_constants.doc_status.published});
    findQuery.limit(3);
    return findQuery.then(function (stories) {
      return stories;
    });
  },
};
