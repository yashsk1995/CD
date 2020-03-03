var request = require('supertest');

describe('LoginController', function () {

  describe('Login', function () {
    it('should login end user', function (done) {
      request(sails.hooks.http.app)
        .post('/login')
        .send({email: 'test_end@user.com', password: 'test123'})
        .expect(200)
        .expect({
          status: 'success',
          message: '',
          error: ''
        }, done);
    });
  });

  describe('Unauthorized Access', function () {

    it('should redirect to loan calculator from /quick-application', function (done) {
      request(sails.hooks.http.app)
        .get('/quick-application')
        .expect(302)
        .expect('location', '/advance-calculator', done);
    });

    it('should redirect to loan calculator from /confidence-rate', function (done) {
      request(sails.hooks.http.app)
        .get('/confidence-rate')
        .expect(302)
        .expect('location', '/advance-calculator', done);
    });


    it('should redirect to loan calculator from /application', function (done) {
      request(sails.hooks.http.app)
        .get('/application')
        .expect(302)
        .expect('location', '/advance-calculator', done);
    });


  });

});
