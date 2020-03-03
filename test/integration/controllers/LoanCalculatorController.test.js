/**
 * Created by meeaa on 6/5/2017.
 */
var request = require('supertest');

describe('Loan Calculator', function () {

  describe('Advance Calculator', function () {
    it('should render advance calculator', function (done) {
      request(sails.hooks.http.app)
        .get('/advance-calculator')
        .expect(200)
        .expect(/Loan Customizer/, done);
    });

    it('should calculate quick loan and show result', function (done) {
      request(sails.hooks.http.app)
        .post('/quick-calculator/calculate')
        .send({
          loanType: "Purchase",
          propertyType: "Multi-Family",
          propertyPrice: "20000",
          loanAmount: "10000",
          propertyAddress: "260 A Block Gulshan e Ravi Lahore",
          propertyCity: "Lahore",
          propertyState: "CT",
          propertyOccupancy: "owner_occupied",
          closeWithin: "30 days",
          creditScore: "750",
          program: "4",
          amortizationTerm: "19",
          prepayPenalty: "3",
          interestOnlyPeriodMonths: "8",
          paymentDay: "16",
          rateBuyDown: "0.33",
          documentation: "Platinum"
        })
        .expect(200)
        .expect(/Great! Based on your inputs, your property is eligible for a loan./, done);
    });

    it('should calculate advance loan and show result', function (done) {
      request(sails.hooks.http.app)
        .post('/advance-calculator/calculate')
        .send({
          loanType: "Purchase",
          propertyType: "Multi-Family",
          propertyPrice: "20000",
          loanAmount: "10000",
          propertyAddress: "260 A Block Gulshan e Ravi Lahore",
          propertyCity: "Lahore",
          propertyState: "CT",
          propertyOccupancy: "owner_occupied",
          closeWithin: "30 days",
          creditScore: "750",
          program: "4",
          amortizationTerm: "19",
          prepayPenalty: "3",
          interestOnlyPeriodMonths: "8",
          paymentDay: "16",
          rateBuyDown: "1.33",
          documentation: "Platinum"
        })
        .expect(200)
        .expect(/Great! Based on your inputs, your property is eligible for a loan./)
        .expect(/Based on these parameters and the other options you selected,/, done);
    });

    it('should calculate and save loan and redirect to quick application', function (done) {
      this.timeout(60000);
      request(sails.hooks.http.app)
        .post('/loan-application/save')
        .send({
          amortizationTerm: "24",
          closeWithin: "15 days",
          creditScore: "800",
          documentation: "Platinum",
          name: 'testing user',
          email: "testing@cd.com",
          interestOnlyPeriodMonths: "7",
          loanAmount: "8000000",
          loanType: "Purchase",
          paymentDay: "16",
          phoneNumber: "5555551234",
          prepayPenalty: "3",
          program: "3",
          propertyAddress: "260 A Block Gulshan E Ravi Lahore",
          propertyCity: "Lhoare",
          propertyOccupancy: "owner_occupied",
          propertyPrice: "15000000",
          propertyState: "AK",
          propertyType: "Warehouse",
          rateBuyDown: "0.33",
          resultingMonthlyPayment: "45668.63",
          resultingRate: "6.75",
          type: "advance",
          id: 1
        })
        .expect(302)
        .expect('location', '/quick-application', done);
    });


  });
});
