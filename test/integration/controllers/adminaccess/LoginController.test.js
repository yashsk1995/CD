var request = require('supertest');

describe('LoginController', function () {

  describe('Login', function () {
    it('should login user and redirect to blogcategories', function (done) {
      request(sails.hooks.http.app)
        .post('/adminaccess')
        .send({email: 'zee@gmail.com', password: 'zee123'})
        .expect(302)
        .expect('location', '/adminaccess/blogcategories', done);
    });
  });

  describe('Forgot Password', function () {
    it('should render forgot password page', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/forgot-password')
        .expect(200)
        .expect(/Forgot Password/, done);
    });

    it('should send forgot password email', function (done) {
      this.timeout(10000);
      request(sails.hooks.http.app)
        .post('/adminaccess/forgot-password')
        .send({email: 'zee@gmail.com'})
        .expect(200)
        .expect(/An Email has been sent to your email address/, done);
    });
  });



  describe('Reset Password', function () {
    var verificationToken = {};
    before(function (done) {
      VerificationToken.findOne({userId: 1}).then(function (token) {
        verificationToken = token;
        done();
      });
    });

    it('should render reset password page', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/reset-password/' + verificationToken.token)
        .expect(200)
        .expect(/Reset Password/, done);
    });

    it('should send reset password', function (done) {
      request(sails.hooks.http.app)
        .post('/adminaccess/reset-password')
        .send({password: 'zee123', confirmPassword: 'zee123', token: verificationToken.token})
        .expect(302)
        .expect('location', '/adminaccess', done);
    });
  });

  describe('Unauthorized Access', function () {

    it('should redirect to login page from /adminaccess/blogcategories', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/blogcategories')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/blogposts', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/blogposts')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/faqs', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/faqs')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/knowledgebasetopics', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/knowledgebasetopics')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/knowledgebasearticles', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/knowledgebasearticles')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/landingpages', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/landingpages')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/successstories', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/successstories')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/users', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/users')
        .expect(302, done);
    });

    it('should redirect to login page from /adminaccess/whitelistedips', function (done) {
      request(sails.hooks.http.app)
        .get('/adminaccess/whitelistedips')
        .expect(302, done);
    });

  });

});
