/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Landing Page Controller', function () {

  describe('Landing Page', function () {
    it('should load landing page', function (done) {
      request(sails.hooks.http.app)
        .get('/l/test')
        .expect(200)
        .expect(/Test Landing Page/, done);
    });
  });
});
