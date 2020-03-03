/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
module.exports = {

  render: next(function* (req, res, next) {
    var sales_reps = yield ConfigService.getByKey(sails.config.app_constants.configs.salesReps);
    var lists = yield ConfigService.getByKey(sails.config.app_constants.configs.lists);
    var states = [];
    if(lists['states']){
      states = lists['states'];
    }
    res.view('adminaccess/sales_reps', {
      layout: 'adminaccess/layout',
      title: 'Sales Reps',
      sales_reps: sales_reps,
      states: states
    });
  }),

  save: next(function* (req, res, next) {
    var allParams = req.allParams();
    allParams = allParams['data']
    yield ConfigService.createOrUpdate(sails.config.app_constants.configs.salesReps, allParams);
    res.redirect('/adminaccess/sales_reps');
  })
};

