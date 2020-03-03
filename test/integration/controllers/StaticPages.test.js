/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Static Pages', function () {

  describe('Home Page', function () {
    it('should render homepage', function (done) {
      request(sails.hooks.http.app)
        .post('/')
        .expect(200, done)
    });

    it('should render about page', function (done) {
      request(sails.hooks.http.app)
        .post('/about')
        .expect(200)
        .expect(/About/, done)
    });

    it('should render learn page', function (done) {
      request(sails.hooks.http.app)
        .post('/learn')
        .expect(200)
        .expect(/Learn/, done)
    });
  });
});
