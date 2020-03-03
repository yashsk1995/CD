/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Frequently Asked Question Controller', function () {

  describe('FAQ', function () {
    it('should list all faqs', function (done) {
      request(sails.hooks.http.app)
        .post('/faq')
        .expect(200)
        .expect(/Asked Questions/)
        .expect(/Frequently/, done);
    });

    it('should save the feedback', function (done) {
      request(sails.hooks.http.app)
        .post('/faq/feedback')
        .send({faqId: 1, helpful: true})
        .expect(200, {
          status: 'success',
          message: ''
        }, done);
    });
  });
});
