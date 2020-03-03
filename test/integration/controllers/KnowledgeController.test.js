/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Knowledge Base Controller', function () {

  describe('Knowledge Base', function () {
    it('should list knowledge base articles', function (done) {
      request(sails.hooks.http.app)
        .get('/knowledge')
        .expect(200)
        .expect(/Knowledge Base/, done);
    });

    it('should load knowledge base article detail', function (done) {
      request(sails.hooks.http.app)
        .get('/knowledge/Test-Topic/Testing-term-1')
        .expect(200)
        .expect(/Knowledge Base/)
        .expect(/Article/, done)
    });
  });
});
