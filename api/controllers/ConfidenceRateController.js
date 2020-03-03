/**
 * ApplicationController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var wkhtmltopdf = require('wkhtmltopdf');

module.exports = {


  render: function (req, res, next) {
    var endUserId = req.user.endUser;
    LoanApplicationService.getByEndUser(endUserId).then(function (application) {
      return res.view('confidence_rate', {application: application});
    }).catch(function (error) {
      return res.redirect('/404');
    });
  },

  downloadTermSheet: function (req, res, next) {
    var pageURL = sails.config.print_url + '/print/loan-terms/' + req.user.endUser;
    res.setHeader('Content-disposition', 'attachment; filename=Loan Terms.pdf');
    res.setHeader('Content-type', 'application/pdf');
    wkhtmltopdf(pageURL, {pageSize: 'a4'}).pipe(res);
  }

};

