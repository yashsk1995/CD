/**
 * VideoPostController
 *
 * @description :: Server-side logic for displaying blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res, next) {
    var search = '';
    var sort = '';
    var page = req.param('page') || 1;
    var limit = 6;
    var type = sails.config.app_constants.staticContentType.videos;
    Promise.all([StaticContentService.getByType(type), VideoCategoryService.list(search, sort, page, limit)]).then(function(response) {
      return res.view('video_page', {
        videoData: response[0].videos || '',
        videoCategories: response[1].videoCategories,
        currentPage: page,
        pageCount: response[1].pageCount,
        locals: {
          pageTitle: "Commercial Direct - Videos"
        }
      });
    })

  },

  detail: function (req, res, next) {
    var slug = req.param('slug');
    if(slug) {
      VideoPostService.findBySlug(slug).then(function (videoPost) {
        VideoCategoryService.findByName(videoPost.category).then(function (category) {
          return res.view('video_detail', {
            videoPost: videoPost,
            category: category,
            locals: {
              pageTitle: videoPost.name,
              keywords: videoPost.keywords,
              tags: videoPost.metaTags,
              author: videoPost.authorName,
              title: videoPost.pageTitle,
            }
          });
        }).catch(function (err) {
          return res.view('404')
        });
      }).catch(function (err) {
        return res.view('404')
      });
    }
  },

  listCategory: function (req, res, next) {
    var search = req.param('search') || '';
    var slug = req.param('slug') || '';
    var page = req.param('page') || 1;
    var limit = 9;
    VideoCategoryService.findBySlug(slug).then(function(category) {
      ElasticSearchService.searchByType(sails.config.app_constants.es_types.video, search).then(function (ids) {
        return VideoPostService.listbyCategory(category.name,'publishedAt DESC', page, limit, true)
      }).then(function (blogPosts) {
        return res.view('video_category_list', {
          search: search,
          currentPage: page,
          pageCount: blogPosts.pageCount,
          videoPosts: blogPosts.posts,
          category: category,

          locals: {
            pageTitle: category.name
          }
        });
      }).catch(function (err) {
        next(err);
      });
    }).catch(function (err) {
      next(err);
    });

  }

};

