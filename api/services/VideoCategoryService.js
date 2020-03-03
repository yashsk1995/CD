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
    
        var countQuery = VideoCategory.count(criteria);
    
        var findQuery = VideoCategory.find(criteria);
    
        if (sort) findQuery.sort(sort);
        if (page) findQuery.paginate({page: page, limit: limit});
        findQuery.populate('author');
        return Promise.all([countQuery, findQuery]).then(function (response) {
          var pageCount = Math.ceil(response[0] / limit);
          return {
            pageCount: pageCount,
            videoCategories: response[1]
          }
        });
      },
    
      create: function (params) {
        return VideoCategory.create(params).then(function (category) {
          return category;
        }).catch(function (err) {
          if (err.ValidationError) {
            var handledError = HandleErrorService.handle(VideoCategory, err.ValidationError)
            throw handledError;
          }
          throw {message: err.details};
        });
      },
    
      findById: function (id) {
        return VideoCategory.findOne({id: id}).then(function (category) {
          if (category) return category;
          throw {};
        });
      },

      findByName: function (categoryName) {
        console.log(categoryName)
        return VideoCategory.findOne({name: categoryName}).then(function (category) {
          if (category) return category;
          throw {};
        });
      },

      findBySlug: function (slug) {
        return VideoCategory.findOne({slug: slug}).then(function (category) {
          if (category) return category;
          throw {};
        });
      },
    
      update: function (id, params) {
        return VideoCategory.update({id: id}, params).then(function (category) {
          return category;
        }).catch(function (err) {
          if (err.ValidationError) {
            var handledError = HandleErrorService.handle(VideoCategory, err.ValidationError)
            throw handledError;
          }
          throw {message: err.details};
        });
      },
    
      delete: function (id) {
        return VideoCategory.destroy({id: id}).then(function (category) {
          return category;
        }).catch(function (err) {
          throw {message: err.details};
        });
      }
    
    };
    