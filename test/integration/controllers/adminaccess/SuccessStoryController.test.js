var session = require('supertest-session');

describe('Success Story Controller', function () {

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

  describe('New Success Story', function () {
    it('should render new success story page', function (done) {
      authenticatedSession.get('/adminaccess/successstory/create')
        .expect(200)
        .expect(/New Story/, done);
    });

    it('should create a new success story ', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/successstory/create')
        .field('id', 2)
        .field('title', 'Testing Success Story 2')
        .field('bodyHTML', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('purposeTags', 'tag1,tag2,tag3')
        .field('propertyTypeTags', 'tag1,tag2,tag3')
        .field('propertyTypeTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Draft')
        .field('category', 'Testing Category')
        .field('author', 1)
        .attach('previewImage', 'test/images/sample1.jpg')
        .expect(302)
        .expect('location', '/adminaccess/successstories', done);
    });
  });

  describe('Edit Success Story', function () {
    it('should render edit success story page', function (done) {
      authenticatedSession.get('/adminaccess/successstory/edit/2')
        .expect(200)
        .expect(/Edit Story/, done);
    });

    it('should edit a success story', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/successstory/edit/2')
        .field('title', 'Updated Testing Success Story 2')
        .field('bodyHTML', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('purposeTags', 'tag1,tag2,tag3')
        .field('propertyTypeTags', 'tag1,tag2,tag3')
        .field('propertyTypeTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Published')
        .field('category', 'Testing Category')
        .field('author', 1)
        .field('publishedAt', new Date().toDateString())
        .attach('previewImage', 'test/images/sample2.jpg')
        .expect(302)
        .expect('location', '/adminaccess/successstories', done);
    });
  });

  describe('List Success Stories', function () {
    it('should list all success stories', function (done) {
      authenticatedSession.get('/adminaccess/successstories')
        .expect(200)
        .expect(/Showcase/, done);
    });

    it('should publish success stories', function (done) {
      authenticatedSession.get('/adminaccess/successstory/publish?id=2')
        .expect(302)
        .expect('location', '/adminaccess/successstories', done);
    });

    it('should delete success stories', function (done) {
      authenticatedSession.get('/adminaccess/successstory/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/successstories', done);
    });
  });

});
