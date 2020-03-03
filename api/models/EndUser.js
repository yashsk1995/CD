/**
 * End User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    fullName: {
      type: 'string'
    },

    streetAddressOne: {
      type: 'string'
    },

    streetAddressTwo: {
      type: 'string'
    },

    city: {
      type: 'string'
    },

    state: {
      type: 'string'
    },

    zipCode: {
      type: 'string'
    },

    isPaidAccount: {
      type: 'boolean'
    },

    yearsInBusiness: {
      type: 'integer'
    },

    industryType: {
      type: 'string'
    },

    annualRevenue: {
      type: 'integer'
    },

    annualExpenses: {
      type: 'integer'
    },

    phoneNumber: {
      type: 'string'
    },

    progress: {
      type: 'string'
    },

    salesForceId: {
      type: 'string'
    }

  }


};

