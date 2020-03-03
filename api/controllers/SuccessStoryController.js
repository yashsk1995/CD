/**
 * SuccessStoryController
 *
 * @description :: Server-side logic for displaying success stories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res, next) {
    var tags = req.param('tags') || [];

    SuccessStoryService.listByTags(tags).then(function (stories) {
      return Promise.all([stories, SuccessStoryService.listAllTags(),
        StaticContentService.getByType(sails.config.app_constants.staticContentType.showcase)]);
    }).then(function (data) {
      return res.view('success_story_list', {
        successStories: data[0],
        metaTags: data[1],
        content: data[2],
        tags: tags
      });
    }).catch(function (err) {
      return next(err);
    });
  },


  detail: function (req, res, next) {
    var id = req.param('id');
    SuccessStoryService.findPublishedById(id).then(function (successStory) {
      return Promise.all([successStory, SuccessStoryService.listOther(id)]);
    }).then(function (data) {
      return res.view('success_story_detail', {
        story: data[0],
        otherStories: data[1]
      });
    }).catch(function (err) {
      return next(err);
    });
  }

};

