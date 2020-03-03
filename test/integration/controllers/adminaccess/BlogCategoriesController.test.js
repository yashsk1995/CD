var request = require('supertest');
var session = require('supertest-session');

describe('Blog Categories Controller', function () {

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


  describe('New Blog Category', function () {
    it('should render new blog category page', function (done) {
      authenticatedSession.get('/adminaccess/blogcategory/create')
        .expect(200)
        .expect(/New Category/, done);
    });

    it('should create a blog category', function (done) {
      authenticatedSession.post('/adminaccess/blogcategory/create')
        .send({name: 'Testing Category 2', author: 1})
        .expect(302)
        .expect('location','/adminaccess/blogcategories', done);
    });
  });

  describe('Edit Blog Category', function () {
    it('should render edit blog category page', function (done) {
      authenticatedSession.get('/adminaccess/blogcategory/edit/2')
        .expect(200)
        .expect(/Edit Category/, done);
    });

    it('should edit existing blog category', function (done) {
      authenticatedSession.post('/adminaccess/blogcategory/edit/2')
        .send({name: 'Updated Category 2', author: 1})
        .expect(302)
        .expect('location','/adminaccess/blogcategories', done);
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
        .expect('location','/adminaccess/blogcategories', done);
    });
  });

});
