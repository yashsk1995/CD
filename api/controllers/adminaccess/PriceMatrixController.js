/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
module.exports = {

  render: next(function* (req, res, next) {
    var loanLookup = yield ConfigService.getByKey(sails.config.app_constants.configs.loanLookup);
    res.view('adminaccess/price_matrix', {
      layout: 'adminaccess/layout',
      title: 'Price Matrix',
      loanLookupKeys: sails.config.loan_constants.loanLookupKeys,
      loanLookup: loanLookup
    });
  }),

  save: next(function* (req, res, next) {
    var allParams = req.allParams();
    // var loanLookUp = {};
    // var _this = this;
    // _.each(Object.keys(allParams), function (paramKey) {
    //   var keys = paramKey.split('_');
    //   if (keys.length == 3 && allParams[paramKey]) {
    //     _this.assign(loanLookUp, keys, allParams[paramKey]);
    //   }
    // });

    // _.each(Object.keys(loanLookUp), function (tier) {
    //   _.each(Object.keys(loanLookUp[tier]), function (cr) {
    //     var keys = Object.keys(loanLookUp[tier][cr]);
    //     var lastKey = keys[keys.length - 1];
    //     _this.assign(loanLookUp, [tier, cr, 'max'], lastKey);
    //   });
    // });

    yield ConfigService.createOrUpdate(sails.config.app_constants.configs.loanLookup, allParams);
    // res.redirect('/adminaccess/pricematrix');
    res.send('ok');
  }),

  assign: function (obj, keyPath, value) {
    var lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      var key = keyPath[i];
      if (!(key in obj))
        obj[key] = {};
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }
};

