var session = require('supertest-session');

describe('Quick Application Controller', function () {
  var testSession = null;
  var authenticatedSession;

  beforeEach(function (done) {
    testSession = session(sails.hooks.http.app);
    testSession.post('/login')
      .send({email: 'test_end@user.com', password: 'test123'})
      .expect(200)
      .expect({
        status: 'success',
        message: '',
        error: ''
      })
      .end(function (err) {
        if (err) return done(err);
        authenticatedSession = testSession;
        return done();
      });
  });

  describe('Quick Application', function () {
    it('should render quick application form', function (done) {
      authenticatedSession.get('/quick-application')
        .expect(200)
        .expect(/Application/, done);
    });

    it('should save quick application ', function (done) {
      this.timeout(600000);
      authenticatedSession.post('/quick-application/1')
        .send({
          name: "Test",
          email: "test_end@user.com",
          phoneNumber: "5555551234",
          streetAddressOne: "House No 20 Street 3",
          streetAddressTwo: "House no 30 Street 4",
          city: "Chicago",
          state: "IL",
          zipCode: "545000",
          yearsInBusiness: "20",
          industryType: "LLC",
          annualRevenue: "20000",
          annualExpenses: "10000"
        })
        .expect(302)
        .expect('location', '/confidence-rate', done);
    });
  });

});
