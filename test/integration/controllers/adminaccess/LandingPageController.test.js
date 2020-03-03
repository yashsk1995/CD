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

  describe('New Landing Page', function () {
    it('should render new landing page', function (done) {
      authenticatedSession.get('/adminaccess/landingpage/create')
        .expect(200)
        .expect(/New Landing Page/, done);
    });

    it('should create a new landing page', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/landingpage/create')
        .field('id', 2)
        .field('title', 'Test Landing Page 2')
        .field('body', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('metaTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Draft')
        .field('category', 'Testing Category')
        .field('author', 1)
        .attach('localPhoto', 'test/images/sample2.jpg')
        .attach('headerImage', 'test/images/sample3.jpg')
        .expect(302)
        .expect('location', '/adminaccess/landingpages', done);
    });
  });

  describe('Edit Landing Page', function () {
    it('should render edit landing page', function (done) {
      authenticatedSession.get('/adminaccess/landingpage/edit/2')
        .expect(200)
        .expect(/Edit Landing Page/, done);
    });

    it('should edit a landing page', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/landingpage/edit/2')
        .field('title', 'Updated Testing Landing Page 2')
        .field('bodyHTML', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('metaTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Published')
        .field('category', 'Testing Category')
        .field('author', 1)
        .field('publishedAt', new Date().toDateString())
        .attach('localPhoto', 'test/images/sample1.jpg')
        .attach('headerImage', 'test/images/sample2.jpg')
        .expect(302)
        .expect('location', '/adminaccess/landingpages', done);
    });
  });

  describe('List Landing Page', function () {
    it('should list all landing page', function (done) {
      authenticatedSession.get('/adminaccess/landingpages')
        .expect(200)
        .expect(/Landing Page/, done);
    });

    it('should delete landing page', function (done) {
      authenticatedSession.get('/adminaccess/landingpage/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/landingpages', done);
    });
  });

});
