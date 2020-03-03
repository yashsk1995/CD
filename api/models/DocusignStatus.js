/**
 * Created by zeeshan on 5/9/2017.
 */
module.exports = {

  attributes: {

    envelopeId: {
      type: 'string'
    },

    hasBorrowerSigned: {
      type: 'boolean'
    },

    hasCoBorrowerSigned: {
      type: 'boolean'
    },

    hasCoBorrower2Signed: {
      type: 'boolean'
    },

    hasCoBorrower3Signed: {
      type: 'boolean'
    },

    hasCommercialDirectSigned: {
      type: 'boolean'
    },

    fullApplication: {
      model: 'FullApplication'
    },

    endUser: {
      model: 'EndUser'
    }

  }
};
