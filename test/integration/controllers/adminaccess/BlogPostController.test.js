var session = require('supertest-session');

describe('Blog Post Controller', function () {

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


  describe('Create Blog Post', function () {
    it('should render new blog post page', function (done) {
      authenticatedSession.get('/adminaccess/blogpost/create')
        .expect(200)
        .expect(/New Post/, done);
    });

    it('should create a blog post', function (done) {
      this.timeout(60000);
      authenticatedSession.post('/adminaccess/blogpost/create')
        .field('id', 2)
        .field('title', 'Testing Blog Post 2')
        .field('publishedAt', new Date().toDateString())
        .field('bodyHTML', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('metaTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Published')
        .field('category', 'Testing Category')
        .field('authorId', 1)
        .field('authorName', 'Zeeshan Abbas')
        .attach('previewImage', 'test/images/sample1.jpg')
        .attach('headerImage', 'test/images/sample2.jpg')
        .expect(302)
        .expect('location', '/adminaccess/blogposts', done);
    });
  });

  describe('Edit Blog Post', function () {
    it('should render edit blog post page', function (done) {
      authenticatedSession.get('/adminaccess/blogpost/edit/1')
        .expect(200)
        .expect(/Edit Post/, done);
    });

    it('should edit existing blog category', function (done) {
      authenticatedSession.post('/adminaccess/blogcategory/edit/2')
        .field('title', 'Updated Testing Blog Post 2')
        .field('publishedAt', new Date().toDateString())
        .field('bodyHTML', 'Body HTML')
        .field('slug', 'Slug')
        .field('pageTitle', 'Page Title')
        .field('metaTags', 'tag1,tag2,tag3')
        .field('keywords', 'key1,key2')
        .field('status', 'Published')
        .field('category', 'Testing Category')
        .field('authorId', 1)
        .field('authorName', 'Zeeshan Abbas')
        .attach('previewImage', 'test/images/sample2.jpg')
        .attach('headerImage', 'test/images/sample1.jpg')
        .expect(302)
        .expect('location', '/adminaccess/blogcategories', done);
    });
  });

  describe('List Blog Categories', function () {
    it('should list all the blog categories', function (done) {
      authenticatedSession.get('/adminaccess/blogcategories')
        .expect(200)
        .expect(/Blog Category/, done);
    });

    it('should delete blog category', function (done) {
      authenticatedSession.get('/adminaccess/blogcategory/delete?id=2')
        .send({name: 'Updated Category', author: 1})
        .expect(302)
        .expect('location', '/adminaccess/blogcategories', done);
    });
  });

});
