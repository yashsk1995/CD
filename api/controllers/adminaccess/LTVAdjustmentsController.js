/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
module.exports = {

  render: next(function* (req, res, next) {
    var ltvAdjustments = yield ConfigService.getByKey(sails.config.app_constants.configs.ltvAdjustments);
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    res.view('adminaccess/ltv_adjustments', {
      layout: 'adminaccess/layout',
      title: 'LTV Adjustments',
      ltvAdjustments: ltvAdjustments,
      lists: lists
    });
  }),

  save: next(function* (req, res, next) {
    var allParams = req.allParams();
    
    yield ConfigService.createOrUpdate(sails.config.app_constants.configs.ltvAdjustments, allParams);
    res.send('ok');
  })
};

