var session = require('supertest-session');

describe('User Controller', function () {
  var testSession = null;
  var authenticatedSession;
  var user = {
    id: 3,
    name: 'zeesh',
    email: 'test@test.com',
    password: 'cd_test'
  };

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

  describe('New User', function () {
    it('should render new user page', function (done) {
      authenticatedSession.get('/adminaccess/user/create')
        .expect(200)
        .expect(/New User/, done);
    });

    it('should create a new user', function (done) {
      authenticatedSession.post('/adminaccess/user/create')
        .send(user)
        .expect(302)
        .expect('location', '/adminaccess/users', done);
    });
  });

  describe('Edit User', function () {
    it('should render edit user page', function (done) {
      authenticatedSession.get('/adminaccess/user/edit/' + user.id)
        .expect(200)
        .expect(/Edit User/, done);
    });

    it('should edit a user', function (done) {
      authenticatedSession.post('/adminaccess/user/edit/' + user.id)
        .send({
          name: 'testing name',
          email: 'testing@email.com',
          password: 'test123'
        })
        .expect(302)
        .expect('location', '/adminaccess/users', done);
    });
  });

  describe('List Users', function () {
    it('should list all users', function (done) {
      authenticatedSession.get('/adminaccess/users')
        .expect(200)
        .expect(/User/, done);
    });

    it('should delete user', function (done) {
      authenticatedSession.get('/adminaccess/user/delete?id=' + user.id)
        .expect(302)
        .expect('location', '/adminaccess/users', done);
    });

    it('should active user', function (done) {
      authenticatedSession.get('/adminaccess/user/active?id=' + user.id)
        .expect(302)
        .expect('location', '/adminaccess/users', done);
    });

  });

});
