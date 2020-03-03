/**
 * Created by zeeshan on 3/15/2017.
 */

module.exports.sales_force_constants = {


  entity_types: {
    Personal: 'Individual(s)',
    Entity: 'Entity'
  },

  loan_types: {
    'Purchase': 'Purchase',
    'Refinance': 'Refinance',
    'Cash Out Refinance': 'Cash Out'
  },

  prepayment_options: {
    2: '5% for 2',
    3: '5% for 3',
    4: '5% for 4',
    5: '5% for 5'
  },

  lead_prepayment_options: {
    2: 'Custom: 5% for 2 years',
    3: 'Standard Pre-Payment Penalty',
    4: 'Custom: 5% for 4 years',
    5: 'Extended Pre-Payment Penalty'
  },

  credit_score: {
    '800': '800+',
    '775': '775-799',
    '750': '750-774',
    '725': '725-749',
    '700': '700-724',
    '675': '675-699',
    '650': '650-674'
  },

  occupancy: {
    'owner_occupied': 'Owner Occupied',
    'rented': 'Investor'
  },

  convertArrayToString: function (values) {
    if (values instanceof Array) {
      return values.join(";");
    }
    return values;
  }


};
