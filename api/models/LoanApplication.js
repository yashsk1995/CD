/**
 * CustomLoan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    ip: {
      type: 'string'
    },

    loanType: {
      type: 'string'
    },

    source: {
      type: 'string'
    },

    sourceUrl: {
      type: 'string'
    },

    propertyType: {
      type: 'string'
    },

    propertyPrice: {
      type: 'integer',
      size: 20
    },

    loanAmount: {
      type: 'integer',
      size: 20
    },

    propertyAddress: {
      type: 'string'
    },

    propertyCity: {
      type: 'string'
    },

    propertyState: {
      type: 'string'
    },

    propertyZip: {
      type: 'integer'
    },

    propertyOccupancy: {
      type: 'string'
    },

    closeWithin: {
      type: 'string'
    },

    creditScore: {
      type: 'string'
    },

    rateBuyDown: {
      type: 'float'
    },

    program: {
      type: 'integer'
    },

    prepayPenalty: {
      type: 'integer'
    },

    interestOnlyPeriodMonths: {
      type: 'integer'
    },

    paymentDay: {
      type: 'integer'
    },

    amortizationTerm: {
      type: 'integer'
    },

    documentation: {
      type: 'string'
    },

    resultingRate: {
      type: 'integer'
    },

    resultingMonthlyPayment: {
      type: 'integer'
    },

    endUser: {
      model: 'EndUser'
    }
  },

  validationMessages: {}

};

