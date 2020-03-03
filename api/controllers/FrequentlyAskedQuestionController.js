/**
 * FrequentlyAskedQuestionController
 *
 * @description :: Server-side logic for managing frequently asked questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res, next) {
    FrequentlyAskedQuestionService.list('', '', false, false, true).then(function (response) {
      return res.view('faq', {
        faqs: response.faqs,
        locals: {
          pageTitle: "Commercial Direct - Frequently Asked Questions", 
        }
      });
    }).catch(function (err) {
      return next(err);
    });
  },

  saveFeedback: function (req, res) {
    var helpful = req.param('helpful');
    var faqId = req.param('faqId');
    FrequentlyAskedQuestionService.createFeedback(helpful, faqId).then(function (faq) {
      res.send({
        status: 'success',
        message: ''
      });
    }).catch(function (error) {
      res.send({
        status: 'failed',
        message: 'Unable to save feedback'
      });
    })
  }
};

