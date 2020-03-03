var session = require('supertest-session');

describe('Landing Page Controller', function () {

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

  describe('Static Content', function () {
    it('should render static content', function (done) {
      authenticatedSession.get('/adminaccess/staticcontent')
      .expect(200)
      .expect(/Static Content/, done);
    });

    it('should create a new static content ', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/staticcontent')
        .field('aboutUs', "Dummy Text for testing")
        .field('privacyPolicy', "Dummy Text for testing")
        .field('showcase', "Dummy Text for testing")
        .field('contactUs', "Dummy Text for testing")
        .field('loanCustomizer', "Dummy Text for testing")
        .field('termsAndConditions', "Dummy Text for testing")
        .field('aboutBayview', "Dummy Text for testing")
        .field('sampleTestimonial', "Dummy Text for testing")
        .expect(302)
        .expect('location', '/adminaccess/staticcontent', done);
    });

  });

  describe('Static Content - Learn', function () {
    it('should render static content', function (done) {
      authenticatedSession.get('/adminaccess/staticcontent-learn')
      .expect(200)
      .expect(/Static Content Learn/, done);
    });

    it('should create a new static content learn ', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/staticcontent-learn/create')
        .field('propertyTypes', "Dummy Text for testing")
        .field('programs', "Dummy Text for testing")
        .field('articles', "Dummy Text for testing")
        .field('knowledgeBase', "Dummy Text for testing")
        .field('frequentlyAskedQuestions', "Dummy Text for testing")
        .expect(302)
        .expect('location', '/adminaccess/staticcontent', done);
    });
  });

});
