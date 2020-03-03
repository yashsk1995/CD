/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
module.exports = {

  render: next(function* (req, res, next) {
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    res.view('adminaccess/lists', {
      layout: 'adminaccess/layout',
      title: 'Lists',
      lists: lists,
    });
  }),

  save: next(function* (req, res, next) {
    var allParams = req.allParams();
    allParams = allParams['lists'];
    yield ConfigService.createOrUpdate(sails.config.app_constants.configs.lists, allParams);
    res.redirect('/adminaccess/lists');
  })
};

