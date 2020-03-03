/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {

  list: function (search, sort, page, limit) {

    var criteria = {
      where: {
        name: {'contains': search}
      }
    };

    var countQuery = BlogCategory.count(criteria);

    var findQuery = BlogCategory.find(criteria);

    if (sort) findQuery.sort(sort);
    if (page) findQuery.paginate({page: page, limit: limit});
    findQuery.populate('author');
    return Promise.all([countQuery, findQuery]).then(function (response) {
      var pageCount = Math.ceil(response[0] / limit);
      return {
        pageCount: pageCount,
        blogCategories: response[1]
      }
    });
  },

  create: function (params) {
    return BlogCategory.create(params).then(function (category) {
      return category;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(BlogCategory, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  findById: function (id) {
    return BlogCategory.findOne({id: id}).then(function (category) {
      if (category) return category;
      throw {};
    });
  },

  update: function (id, params) {
    return BlogCategory.update({id: id}, params).then(function (category) {
      return category;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(BlogCategory, err.ValidationError)
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  delete: function (id) {
    return BlogCategory.destroy({id: id}).then(function (category) {
      return category;
    }).catch(function (err) {
      throw {message: err.details};
    });
  }

};
