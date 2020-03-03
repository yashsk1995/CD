/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit, isPublished, ids) {

    var criteria = {
      where: {
        or: [
          {slug: {'contains': search}},
          {title: {'contains': search}},
          {authorName: {'contains': search}},
          {category: {'contains': search}}
        ]
      }
    };
    if (isPublished) criteria.where['status'] = sails.config.app_constants.doc_status.published;

    if (ids) criteria.where['id'] = ids;

    var countQuery = BlogPost.count(criteria);

    var findQuery = BlogPost.find(criteria);
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
    return BlogPost.create(params).then(function (post) {
      return post;
    }).then(function (post) {
      return ElasticSearchService.index(post, sails.config.app_constants.es_types.blog);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(BlogPost, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  findById: function (id) {
    return BlogPost.findOne({id: id}).then(function (blogPost) {
      if (blogPost) return blogPost;
      throw {};
    });
  },


  findPublishedById: function (id) {
    return BlogPost.findOne({
      id: id,
      status: sails.config.app_constants.doc_status.published
    }).then(function (blogPost) {
      if (blogPost) return blogPost;
      throw {message: 'Blog Post not found'};
    });
  },


  update: function (id, params) {
    return BlogPost.update({id: id}, params).then(function (posts) {
      if (posts.length > 0) {
        return posts;
      }
      throw {message: 'Blog Post not Found'};
    }).then(function (posts) {
      var promiseArr = [];
      posts.forEach(function (post) {
        promiseArr.push(ElasticSearchService.index(post, sails.config.app_constants.es_types.blog));
      });
      return promiseArr;
    }).then(function (promiseArr) {
      return Promise.all(promiseArr);
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(BlogPost, err.ValidationError);
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
    return BlogPost.findOne({
      slug: slug,
      status: sails.config.app_constants.doc_status.published
    }).then(function (article) {
      if (article) return article;
      throw({message: 'Blog post not found'});
    });
  },

};
