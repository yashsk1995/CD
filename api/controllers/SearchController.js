/**
 * KnowledgeBaseTopicController
 *
 * @description :: Server-side logic for managing knowledge base topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  search: function (req, res, next) {
    var search = req.param('q');
    ElasticSearchService.searchAll(search).then(function (results) {
      return res.view('search_result', {
        searchString: search,
        searchResults: results,
        error: {}
      });
    }).catch(function (err) {
      return next(err);
    });
  },

};

