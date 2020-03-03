/**
 * WhitelistedIPController
 *
 * @description :: Server-side logic for managing whitelisted ip
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  _render: function (req, res, next, view, type) {
    StaticContentService.getByType(type).then(function (staticContent) {
      return res.view(view, {content: staticContent});
    }).catch(function (err) {
      return next(err);
    });
  },

  renderAbout: function (req, res, next) {
    //var types = sails.config.app_constants.staticContentType;
    StaticContentService.getAll().then(function (staticContent) {
      return res.view('about', {content: staticContent});
    }).catch(function (err) {
      return next(err);
    });
    //return this._render(req, res, next, 'about', [types.about, types.about_bayview, types.sample_testimonial]);
  },

  renderPrivacy: function (req, res, next) {
    return this._render(req, res, next, 'privacy', sails.config.app_constants.staticContentType.privacy);
  },


  renderTerms: function (req, res, next) {
    return this._render(req, res, next, 'terms', sails.config.app_constants.staticContentType.terms);
  },

  renderContactUs: function (req, res, next) {
    var types = sails.config.app_constants.staticContentType;
    return this._render(req, res, next, 'contact', [types.contact_us, types.about_bayview, types.sample_testimonial]);
  }

};

