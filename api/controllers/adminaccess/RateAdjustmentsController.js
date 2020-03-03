/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
module.exports = {

  render: next(function* (req, res, next) {
    var rateAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.rateAdjustments);
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    res.view('adminaccess/rate_adjustments', {
      layout: 'adminaccess/layout',
      title: 'Rate Adjustments',      
      rateAdjustments: rateAdjustments,
      lists: lists
    });
  }),

  save: next(function* (req, res, next) {
    var allParams = req.allParams();

    yield ConfigService.createOrUpdate(sails.config.app_constants.configs.rateAdjustments, allParams);
    res.redirect('/adminaccess/rateadjustments');
  })
};

