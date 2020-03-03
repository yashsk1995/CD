/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Blog Post Controller', function () {

  describe('Blog Post', function () {
    it('should list blog posts', function (done) {
      request(sails.hooks.http.app)
        .get('/blog')
        .expect(200)
        .expect(/Blog/, done);
    });

    it('should load blog post', function (done) {
      request(sails.hooks.http.app)
        .get('/blog/Slug')
        .expect(200)
        .expect(/Blog/)
        .expect(/Post/, done)
    });
  });
});
