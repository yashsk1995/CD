/**
 * Created by zeeshan on 6/8/2017.
 */
var LoanCalculator = require('../../../api/services/LoanCalculatorService'),
  assert = require('chai').assert;

describe('Loan Calculator Service', function () {
  it('should calculate basic loan for tier 1 and resulting rate should be 7.125', function (done) {
    LoanCalculator.calculateBasic({
      amortizationTerm: "18",
      creditScore: "750",
      documentation: "Platinum",
      interestOnlyPeriodMonths: "11",
      loanAmount: "120000",
      loanType: "Purchase",
      paymentDay: "15",
      prepayPenalty: "3",
      program: "3",
      propertyOccupancy: "owner_occupied",
      propertyPrice: "2000000",
      propertyType: "Mixed-Use Tier 1 (>=50% res)",
      rateBuyDown: "1"
    }).then(function (result) {
      assert.equal(result.resultingRate, '7.125');
      done();
    }).catch(function (error) {
      assert.isUndefined(error, true);
      done();
    });
  });

  it('should calculate basic loan for tier 2 and resulting rate should be 7.25', function (done) {
    LoanCalculator.calculateBasic({
      amortizationTerm: "18",
      creditScore: "750",
      documentation: "Platinum",
      interestOnlyPeriodMonths: "11",
      loanAmount: "120000",
      loanType: "Purchase",
      paymentDay: "15",
      prepayPenalty: "3",
      program: "3",
      propertyOccupancy: "owner_occupied",
      propertyPrice: "2000000",
      propertyType: "Office",
      rateBuyDown: "1"
    }).then(function (result) {
      assert.equal(result.resultingRate, '7.25');
      done();
    }).catch(function (error) {
      assert.isUndefined(error, true);
      done();
    });
  });

  it('should calculate basic loan and result should be not eligible because of LTV ratio', function (done) {
    LoanCalculator.calculateBasic({
      propertyType: 'Office',
      propertyPrice: '100000',
      loanAmount: '80000',
      creditScore: '700',
      amortizationTerm: '15'
    }).then(function (result) {
      assert.isUndefined(result, true);
      done();
    }).catch(function (error) {
      assert.isDefined(error, 'Error is defined');
      assert.equal(error.isLoanRejected, true);
      done();
    });
  });

  it('should calculate basic loan and result should be not eligible because of lower credit score', function (done) {
    LoanCalculator.calculateBasic({
      propertyType: 'Office',
      propertyPrice: '100000',
      loanAmount: '10000',
      creditScore: '600',
      amortizationTerm: '15'
    }).then(function (result) {
      assert.isUndefined(result, true);
      done();
    }).catch(function (error) {
      assert.isDefined(error, 'Error is defined');
      assert.equal(error.isLoanRejected, true);
      done();
    });
  });

});
