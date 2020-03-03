var session = require('supertest-session');

describe('Whitelisted IP Controller', function () {
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

  describe('New Whitelisted IP', function () {
    it('should render new whitelisted IP page', function (done) {
      authenticatedSession.get('/adminaccess/whitelistedip/create')
        .expect(200)
        .expect(/New IP/, done);
    });

    it('should create a new whitelisted IP', function (done) {
      authenticatedSession.post('/adminaccess/whitelistedip/create')
        .send({
          id: 2,
          ip: '192.168.1.1',
          createdBy: 1
        })
        .expect(302)
        .expect('location', '/adminaccess/whitelistedips', done);
    });
  });

  describe('List Whitelisted IP', function () {
    it('should list all whitelisted IPs', function (done) {
      authenticatedSession.get('/adminaccess/whitelistedips')
        .expect(200)
        .expect(/Landing Page/, done);
    });

    it('should delete whitelisted IP', function (done) {
      authenticatedSession.get('/adminaccess/whitelistedip/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/whitelistedips', done);
    });
  });

});
