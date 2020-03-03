/**
 * BlogPostController
 *
 * @description :: Server-side logic for printing
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  renderFullApplication: function (req, res) {
    var endUserId = req.param('id');
    FullApplicationService.getByEndUser(endUserId).then(function (application) {
      if (!application) {
        throw {};
      }
      return res.view('application/full_application', {app: application, layout: ''});

    }).catch(function (error) {
      return res.redirect('/404');
    });
  },

  renderLoanTerms: function (req, res) {
    var endUserId = req.param('id');
    Promise.all([UserService.findByEndUser(endUserId), LoanApplicationService.getByEndUser(endUserId)]).then(function (response) {
      return res.view('loan_terms', {user: response[0], application: response[1], layout: ''});
    }).catch(function (error) {
      return res.redirect('/404');
    });
  }

};

