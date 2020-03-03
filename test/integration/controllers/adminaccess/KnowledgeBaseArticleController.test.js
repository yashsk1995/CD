var session = require('supertest-session');

describe('Knowledge Base Topic Controller', function () {

  var testSession = null;
  var authenticatedSession;

  beforeEach(function (done) {
    testSession = session(sails.hooks.http.app);
    testSession.post('/adminaccess')
      .send({email: 'zee@gmail.com', password: 'zee123'})
      .expect(302)
      .end(function (err) {
        if (err) return done(err);
        authenticatedSession = testSession;
        return done();
      });
  });

  describe('New Knowledge Base Article', function () {
    it('should render new article page', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasearticle/create')
        .expect(200)
        .expect(/New Article/, done);
    });

    it('should create new article', function (done) {
      authenticatedSession.post('/adminaccess/knowledgebasearticle/create')
        .send({id: 2, term: 'Testing term 2', description: 'test description', topic: 1, author: 1})
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasearticles', done);
    });
  });

  describe('Edit Knowledge Base Article', function () {
    it('should render edit article page', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasearticle/edit/2')
        .expect(200)
        .expect(/Edit Article/, done);
    });

    it('should edit an article', function (done) {
      authenticatedSession.post('/adminaccess/knowledgebasearticle/edit/2')
        .send({id: 2, term: 'Updated Testing term 2', description: 'updated test description', topic: 2, author: 1})
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasearticles', done);
    });
  });

  describe('List Knowledge Base Articles', function () {
    it('should list all articles', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasearticles')
        .expect(200)
        .expect(/Knowledge Base Topic/, done);
    });

    it('should publish articles', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasearticle/publish?id=1&id=2')
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasearticles', done);
    });

    it('should delete articles', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasearticle/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasearticles', done);
    });
  });


});
