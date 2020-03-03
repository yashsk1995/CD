/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPublished, ids) {

    var criteria = {
      where: {
        or: [
          {slug: {'contains': search}},
          {name: {'contains': search}},
          {authorName: {'contains': search}},
          {category: {'contains': search}}
        ]
      }
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    if (ids) criteria.where['id'] = ids;

    var countQuery = VideoPost.count(criteria);

    var findQuery = VideoPost.find(criteria);
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});

    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        posts: response[1]
      };
    });
  },

  listbyCategory: function (category, sort, page, limit, isPublished) {

    var criteria = {
      where: {}
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    criteria.where['category'] = category;
    var countQuery = VideoPost.count(criteria);
    var findQuery = VideoPost.find(criteria);
    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});

    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        posts: response[1]
      };
    });
  },

  create: function (params) {
    return VideoPost.create(params).then(function (post) {
      return post;
    }).then(function (post) {
      return ElasticSearchService.index(post, sails.config.app_constants.es_types.video);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(BlogPost, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  findById: function (id) {
    return VideoPost.findOne({id: id}).then(function (blogPost) {
      if (blogPost) return blogPost;
      throw {};
    });
  },

  findPublishedById: function (id) {
    return VideoPost.findOne({
      id: id,
      status: sails.config.app_constants.doc_status.published
    }).then(function (blogPost) {
      if (blogPost) return blogPost;
      throw {message: 'Video Post not found'};
    });
  },

  update: function (id, params) {
    return VideoPost.update({id: id}, params).then(function (posts) {
      if (posts.length > 0) {
        return posts;
      }
      throw {message: 'Video Post not Found'};
    }).then(function (posts) {
      var promiseArr = [];
      posts.forEach(function (post) {
        promiseArr.push(ElasticSearchService.index(post, sails.config.app_constants.es_types.video));
      });
      return promiseArr;
    }).then(function (promiseArr) {
      return Promise.all(promiseArr);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(VideoPost, err.ValidationError);
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

  findBySlug: function (slug) {
    return VideoPost.findOne({
      slug: slug,
      status: sails.config.app_constants.doc_status.published
    }).then(function (article) {
      if (article) return article;
      throw({message: 'Video post not found'});
    });
  },

};
