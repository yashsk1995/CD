/**
 * Created by zeeshan on 5/9/2017.
 */
module.exports = {

  attributes: {

    entityInformation: {
      type: 'string'
    },

    personalBorrowerInfo: {
      type: 'json'
    },

    loanRequest: {
      type: 'json'
    },

    propertyInfo: {
      type: 'json'
    },

    businessInfo: {
      type: 'json'
    },

    employmentInfo: {
      type: 'json'
    },

    incomeExpenseInfo: {
      type: 'json'
    },

    assetsLiabilities: {
      type: 'json'
    },

    personalDeclarations: {
      type: 'json'
    },

    businessDeclarations: {
      type: 'json'
    },

    generalAuthorization: {
      type: 'json'
    },

    infoForMonitoring: {
      type: 'json'
    },

    noOfCoBorrowers: {
      type: 'integer'
    },

    progress: {
      type: 'integer'
    },

    sfApplicationId: {
      type: 'string'
    },

    endUser: {
      model: 'EndUser'
    }


  }
};
