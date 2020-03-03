/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {

    property_address: {
      type: 'string',
    },

    term_sheet_name: {
      type: 'string',
    },

    borrower: {
      type: 'string',
    },

    guarantor: {
      type: 'string'
    },

    broker_fee: {
      type: 'string'
    },

    ltv: {
      type: 'string'
    },

    programe: {
      type: 'string'
    },

    rate: {
      type: 'string'
    },

    mopayment: {
      type: 'string'
    },

    user_login: {
      type: 'string'
    },

    account_owner: {
      type: 'string'
    },

    afdc_id: {
      type: 'string'
    },

    loan_amount: {
      type: 'string'
    },

    property_value: {
      type: 'string'
    },

    property_type: {
      type: 'string',
    },

    occupancy: {
      type: 'string',
    },

    documentation: {
      type: 'string',
    },

    property_state: {
      type: 'string',
    },

    average_middle_credit_score: {
      type: 'string',
    },

    purpose: {
      type: 'string'
    },

    ysp: {
      type: 'string'
    },

    rate_buydown: {
      type: 'string'
    },

    prepay_buydown: {
      type: 'string'
    },

    user_email: {
      type: 'string'
    },

    account_rep: {
      type: 'string'
    },

    user_first_name: {
      type: 'string'
    },

    user_last_name: {
      type: 'string'
    },

    toJSON: function () {
      var obj = this.toObject();
      return obj;
    }
  }
};

