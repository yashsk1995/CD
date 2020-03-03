/**
 * BlogPostController
 *
 * @description :: Server-side logic for displaying blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  list: function (req, res, next) {
    var search = req.param('search') || '';
    var page = req.param('page') || 1;
    var limit = 3;

    ElasticSearchService.searchByType(sails.config.app_constants.es_types.blog, search).then(function (ids) {
      return BlogPostService.list('', 'createdAt DESC', page, limit, true, ids)
    }).then(function (blogPosts) {
      return Promise.all([blogPosts, BlogPostService.list('', 'createdAt DESC', 1, 6, true), BlogPostService.list('', 'createdAt DESC', 1, 5000, true)]);
    }).then(function (data) {
      var categories = [];
      var categoriesCounts = {};
      for (var i = 0; i < data[2].posts.length; i++) {
        if (data[2].posts[i].category.length > 0)
        categories.push(data[2].posts[i].category);
      }
      categories.forEach(function (x) {
        categoriesCounts[x] = (categoriesCounts[x] || 0) + 1;
      });
      categories = Array.from(new Set(categories));
      return res.view('blog_post_list', {
        search: search,
        currentPage: page,
        pageCount: data[0].pageCount,
        blogPosts: data[0].posts,
        recentPosts: data[1].posts,
        postCategories: categories,
        categoriesCount: categoriesCounts,
        locals: {
          pageTitle: "Commercial Direct - Blog"
        }
      });
    }).catch(function (err) {
      next(err);
    });
  },

  detail: function (req, res, next) {
    var slug = req.param('slug');
    if (Number.isInteger(Number(slug))) {
      BlogPostService.findPublishedById(Number(slug)).then(function (blogPost) {
        var url = "/blog/" + blogPost.slug;
        return res.redirect(url);
      }).catch(function () {
        return res.view('404')
      });
    }
    else {
      BlogPostService.findBySlug(slug).then(function (blogPost) {
          return res.view('blog_post_detail', {
            blogPost: blogPost,
            locals: {
              pageTitle: blogPost.name,
              keywords: blogPost.keywords,
              tags: blogPost.metaTags,
              author: blogPost.authorName,
              title: blogPost.pageTitle,
            }
           
          });
      }).catch(function () {
        return res.view('404')
      });
    }
  },

  listCategory: function (req, res, next) {
    var search = req.param('search') || '';
    var category = req.param('category') || '';
    var page = req.param('page') || 1;
    var limit = 3;

    ElasticSearchService.searchByType(sails.config.app_constants.es_types.blog, search).then(function (ids) {
      return BlogPostService.list(category, 'publishedAt DESC', page, limit, true, ids)
    }).then(function (blogPosts) {
      return Promise.all([blogPosts, BlogPostService.list(category, 'publishedAt DESC', 1, 6, true)]);
    }).then(function (data) {
      return res.view('blog_post_category_list', {
        search: search,
        currentPage: page,
        pageCount: data[0].pageCount,
        blogPosts: data[0].posts,
        recentPosts: data[1].posts,
      });
    }).catch(function (err) {
      next(err);
    });
  }

};

