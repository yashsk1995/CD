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

  describe('New Knowledge Base Topic', function () {
    it('should render new topic page', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasetopic/create')
        .expect(200)
        .expect(/New Topic/, done);
    });

    it('should create new topic', function (done) {
      authenticatedSession.post('/adminaccess/knowledgebasetopic/create')
        .send({id: 2, name: 'Testing topic 2', author: 1})
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasetopics', done);
    });
  });


  describe('Edit Knowledge Base Topic', function () {
    it('should render edit topic page', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasetopic/edit/2')
        .expect(200)
        .expect(/Edit Topic/, done);
    });

    it('should edit a topic', function (done) {
      authenticatedSession.post('/adminaccess/knowledgebasetopic/edit/2')
        .send({
          name: 'Updated Topic 2',
          author: 1
        })
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasetopics', done);
    });
  });


  describe('List Knowledge Base Topic', function () {
    it('should list all topics', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasetopics')
        .expect(200)
        .expect(/Knowledge Base Topic/, done);
    });

    it('should delete topic', function (done) {
      authenticatedSession.get('/adminaccess/knowledgebasetopic/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/knowledgebasetopics', done);
    });

  });


});
