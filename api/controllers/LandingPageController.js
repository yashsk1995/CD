/**
 * BlogPostController
 *
 * @description :: Server-side logic for displaying blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  render: function (req, res, next) {
    var slug = req.param('slug') || '';
    var type = sails.config.app_constants.staticContentType.sample_testimonial;

    console.log('typeof req.session.authenticated', req.session.authenticated);
    if(typeof req.session.authenticated == 'undefined' || !req.session.authenticated){
      res.redirect('/login');
      return;
    }

    Promise.all([LandingPageService.findBySlug(slug), StaticContentService.getByType(type)]).then(function (response) {
      if (response[0]) {
        return res.view('landing_page', {
          landingPage: response[0],
          content: response[1],
          states: sails.config.app_constants.lendingStates,
          loanTypes: sails.config.app_constants.loanTypes,
          propertyTypes: sails.config.app_constants.propertyTypes,
          propertyTypesOneToFour: sails.config.app_constants.propertyTypesOneToFour,
          propertyTypesCommercialBridgeLoan: sails.config.app_constants.propertyTypesCommercialBridgeLoan,
          chooseWithin: sails.config.app_constants.chooseWithin,
          creditScores: sails.config.app_constants.creditScore,
          creditScoreCustom: sails.config.app_constants.creditScoreCustom,
          urlParams: req.query,
          sourceUrl: req.originalUrl,
          locals: {
            pageTitle: "Silverhill - " + slug,
          }
        });
      } else {
        res.redirect('/404');
      }
    }).catch(function (error) {
      res.redirect('/404');
    });
  },

  contact: function (req, res, next) {
    var name = req.param('name') || '';
    var email = req.param('email') || '';
    var phone = req.param('phone') || '';
    var data = {
      name: name,
      phone: phone,
      email: email
    }
    EmailService.contactRequest(data).then(function(response) {
      return res.send({
        status: 'success',
        message: '',
        error: ''
      });
    }).catch(function (error) {
      return res.send({
        status: 'failed',
        message: '',
        error: ''
      });
    });
  }
}
