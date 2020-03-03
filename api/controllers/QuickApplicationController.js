/**
 * ApplicationController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var next = require('co-next');

module.exports = {


  continue: function (req, res, next) {
    var id = req.user.endUser;

    EndUserService.findById(id).then(function (endUser) {
      if (endUser.progress == sails.config.app_constants.user_progress.miniApp) {
        res.redirect('/advance-calculator');
      }
      else if (endUser.progress == sails.config.app_constants.user_progress.completedCalculator) {
        res.redirect('/quick-application');
      } else if (endUser.progress == sails.config.app_constants.user_progress.completedQuickApplication) {
        res.redirect('/confidence-rate');
      } else if (endUser.progress.startsWith(sails.config.app_constants.user_progress.startedFullApplication)) {
        res.redirect('/application');
      } else if (endUser.progress.startsWith(sails.config.app_constants.user_progress.fullApplicationStep)) {
        res.redirect('/application');
      } else if (endUser.progress == sails.config.app_constants.user_progress.fullApplicationCompleted) {
        res.redirect('/application');
      } else if (endUser.progress == sails.config.app_constants.user_progress.fullApplicationReview) {
        res.redirect('/application');
      } else {
        next({message: 'Unable to send request'});
      }
    }).catch(function (err) {
      next(err);
    });

  },

  render: function (req, res, next) {
    var id = req.user.endUser;
    Promise.all([EndUserService.findById(id), LoanApplicationService.getByEndUser(id)]).then(function (response) {
      if(response[1] && response[1].propertyType == 'Investor Fix & Flip') {
        return res.redirect('/application-investorflip');
      }
      else{
        return res.view('quick_application', {
          user: req.user,
          endUser: response[0],
          states: sails.config.app_constants.states,
          businessTypes: sails.config.app_constants.businessTypes,
          error: {}
        });
      }
    }).catch(function (error) {
      return next(error);
    });
  },

  renderForInvestorFixFlop: function(req, res, next) {
    return res.view('investorflip', { propType: 'Nothing' });
  },

  save: next(function* (req, res) {
    var id = req.param('id');
    var reqEndUser = req.allParams();
    reqEndUser['progress'] = sails.config.app_constants.user_progress.completedQuickApplication;
    var reqUser = {name: reqEndUser.name};

    try {
      var user = yield UserService.update(req.user.id, reqUser);
      var endUser = yield EndUserService.update(id, reqEndUser);

      yield SalesForceService.createOrUpdateLead(user, endUser);
      return res.redirect('/confidence-rate');
    } catch (err) {
      return res.view('quick_application', {
        user: reqUser,
        endUser: reqEndUser,
        states: sails.config.app_constants.states,
        businessTypes: sails.config.app_constants.businessTypes,
        error: err
      });
    }
  }),
};

