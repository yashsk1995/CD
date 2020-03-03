/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Success Story Controller', function () {

  describe('Success Story', function () {
    it('should list success stories', function (done) {
      request(sails.hooks.http.app)
        .get('/showcase')
        .expect(200)
        .expect(/Showcase/, done);
    });

    it('should load success story', function (done) {
      request(sails.hooks.http.app)
        .get('/showcase/1')
        .expect(200)
        .expect(/Showcase/)
        .expect(/Story/, done)
    });
  });
});
