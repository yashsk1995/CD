/**
 * Created by zeeshan on 7/14/2017.
 */

module.exports.loan_constants = {

  fixedRateLookup: {
    '1': 0,
    '2': 0,
    '3': -0.125,
    '4': -0.125,
    '5': 0,
    '6': 0.125,
    '7': 0.125,
    '8': 0.25,
    '9': 0.25,
    '10': 0.25
  },

  loanTermLookup: {
    '15': -0.375,
    '16': -0.25,
    '17': -0.25,
    '18': -0.25,
    '19': -0.25,
    '20': -0.25,
    '21': -0.125,
    '22': -0.125,
    '23': -0.125,
    '24': -0.125,
    '25': -0.125,
    '26': 0,
    '27': 0,
    '28': 0,
    '29': 0,
    '30': 0
  },

  prepayFeeLookup: {
    '5': -0.25,
    '4': -0.125,
    '3': 0,
    '2': 0.5,
    '1': 0.25,
    '5% for 3 Years': 0,
    '5% for 5 Years': -0.25,
    'Declining 5%, 4%, 3%, 2%, 1%': 2,
  },

  interestOnlyPeriodLookup: {
    '0': 0,
    '1': 0.125,
    '2': 0.125,
    '3': 0.125,
    '4': 0.125,
    '5': 0.125,
    '6': 0.125,
    '7': 0.250,
    '8': 0.250,
    '9': 0.250,
    '10': 0.25,
    '11': 0.25,
    '12': 0.25,
    '13': 0.375,
    '14': 0.375,
    '15': 0.375,
    '16': 0.375,
    '17': 0.375,
    '18': 0.375,
    '19': 0.5,
    '20': 0.5,
    '21': 0.5,
    '22': 0.5,
    '23': 0.5,
    '24': 0.5
  },

  paymentDayLookup: {
    '1': 0,
    '>1': 0.125
  },

  rateBuyDownLookup: {
    '0': 0,
    '0.33': -0.125,
    '0.66': -0.25,
    '1': -0.375,
    '1.33': -0.5,
    '1.66': -0.625,
    '2': -0.750,
    '-0.375 - 1 point': -0.375,
    '-0.75 - 2 points': -0.75,
  },

  documentationLookup: {
    'owner_occupied' : {
      'Platinum' : 0,
      'Silver' : .5,
      'Stated' : 0,
	  'Bank Statement' : 0
    },
    'rented' : {
      'Platinum' : 0,
      'Silver' : 0,
      'Stated' : 0,
	  'Bank Statement' : 0
    }
  },

  loanLookupKeys : {
    tiers : ['Tier I', 'Tier II', 'Interest Only', 'No Doc Streamline'],
    creditScores : ['800', '775', '750', '725', '700', '675', '650'],
    ltvs : ['50', '55', '60', '65', '70', '75', '80'],
    ltvs_vals :  {'50': '0.50', '55': '0.55', '60': '0.60', '65': '0.65', '70': '0.70', '75': '0.75', '80': '0.80'}
  },

  loanTypes: {
    'Purchase': 0,
    'Refinance': 0,
    'Cash Out Refinance': 0.125
  },

  occupancyTierLookup: {
    'Tier I': {
      'owner_occupied': 0,
      'rented': 0,
      'vacant': 0
    },
    'Tier II': {
      'owner_occupied': 0,
      'rented': 0.125,
      'vacant': 0.125
    }

  },

  nonLendingStates: [
    'DE',
    'ID',
    'HI',
    'MT',
    'ND',
    'SD',
    'TN',
    'VT',
    'WV',
    'WY'
  ],

  adjustingStates: {
    'NY' : -10
  },

  adjustmentBasedOnLoanAmountLessThan: {
    '250000' : 0.25
  }

};
