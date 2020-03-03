var session = require('supertest-session');

describe('FAQ Controller', function () {

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

  describe('New FAQ Page', function () {
    it('should render new FAQ page', function (done) {
      authenticatedSession.get('/adminaccess/faq/create')
        .expect(200)
        .expect(/New Question/, done);
    });

    it('should create a faq', function (done) {
      authenticatedSession.post('/adminaccess/faq/create')
        .send({question: 'Testing Question 2', answer: 'Testing Answer', status: 'Draft', author: 1})
        .expect(302)
        .expect('location', '/adminaccess/faqs', done);
    });
  });


  describe('Edit FAQ Page', function () {
    it('should render edit FAQ page', function (done) {
      authenticatedSession.get('/adminaccess/faq/edit/2')
        .expect(200)
        .expect(/Edit Question/, done);
    });

    it('should edit a FAQ', function (done) {
      authenticatedSession.post('/adminaccess/faq/edit/2')
        .send({
          question: 'Updated Testing Question 2',
          answer: 'Updated Testing Answer',
          status: 'Published',
          author: 1
        })
        .expect(302)
        .expect('location', '/adminaccess/faqs', done);
    });
  });


  describe('List FAQs', function () {
    it('should list all FAQs', function (done) {
      authenticatedSession.get('/adminaccess/faqs')
        .expect(200)
        .expect(/FAQ/, done);
    });

    it('should publish faqs', function (done) {
      authenticatedSession.get('/adminaccess/faq/publish?id=1&id=2')
        .expect(302)
        .expect('location', '/adminaccess/faqs', done);
    });

    it('should delete faqs', function (done) {
      authenticatedSession.get('/adminaccess/faq/delete?id=2')
        .expect(302)
        .expect('location', '/adminaccess/faqs', done);
    });
  });

});
