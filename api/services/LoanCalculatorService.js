/**
 * Created by zeeshan on 3/1/2017.
 */

var finance = require('node-finance');
module.exports = {

  calculateBasic: function (params) {
	 
    var _this = this;
    return ConfigService.getByKey(sails.config.app_constants.configs.loanLookup).then(function (loanLookup) {
      return _this._calculateLoan(params, loanLookup);
    }).then(function (response) {
      if (params.amortizationTerm) {
        return _this._calculateMonthlyPayments(response.resultingRate, params.loanAmount, params.amortizationTerm, params.interestOnlyPeriodMonths);
      }
      return response;
    });
  },

  _calculateLoan: function (params, loanLookup){
	  
    var _this = this;
    return new Promise(function (resolve, reject) {
      var state = params.propertyState;
      if (sails.config.loan_constants.nonLendingStates.includes(state)) {
        return reject({
          isLoanRejected: true
        });
      }
      params.propertyPrice = _this._parseCurrency(params.propertyPrice);
      params.loanAmount = _this._parseCurrency(params.loanAmount);
      var tier = _this._calculateTierByProperty(params.propertyType);
	
	 
      var creditScore = params.creditScore > 800 ? 800 : params.creditScore;
	 
      var rate;
      try {
        var loanToValue = _this._calculateLoanToValue(loanLookup, params.propertyPrice, params.loanAmount, params.propertyState, creditScore, tier);
       
		rate = parseFloat(loanLookup[tier][creditScore][loanToValue]);
		console.log(params);
        if (rate) {
          rate = _this._calculateLoanAmountRate(rate, params.loanAmount);
		
         rate = _this._calculateFixedRateProgram(rate, params.program);
		
          rate = _this._calculateLoanTerm(rate, params.amortizationTerm);
		 
          rate = _this._calculatePrepaymentFee(rate, params.prepayPenalty);
		 
          rate = _this._calculateInterestOnlyPeriod(rate, params.interestOnlyPeriodMonths);
		
          rate = _this._calculatePaymentDay(rate, params.paymentDay);
		 
          rate = _this._calculateRateBuydown(rate, params.rateBuyDown);
		
          rate = _this._calculateDocumentation(rate, params.propertyOccupancy, params.documentation);
		 
          rate = _this._calculateLoanTypeRefiance(rate, params.loanType,loanToValue);
		 
          rate = _this._calculateTierOccupancy(rate, params.propertyOccupancy, tier);
		  rate = rate +0.375;
          rate = rate < 6.875 ? 6.875 : rate;
          
          resolve({
            resultingRate: rate,
            resultingMonthlyPayment: 0,
            resultingMonthlyIOPayment: 0
          });
        } else {
          reject({
            isLoanRejected: true
          });
        }

      } catch (error) {
        reject({
          isLoanRejected: true
        });
      }
    })
  },

  _parseCurrency: function (value) {
    if (value && typeof(value) == 'string') {
      var a = value.replace(/,/g, "");
      var s = parseInt(a);
      return s;
    }
    else {
      return value;
    }

  },

  _calculateMonthlyPayments: function (rate, loanAmount, amortization, interestOnlyMonths) {
    var _this = this;
    var duration = (parseInt(amortization) * 12);
    if (interestOnlyMonths && interestOnlyMonths > 0) {
      duration = duration - interestOnlyMonths;
    }
    return this._calculatePMT(rate, duration, loanAmount).then(function (response) {
      var monthlyIOPayment = 0;
      if (interestOnlyMonths && interestOnlyMonths > 0) {
        monthlyIOPayment = _this._calculateIOPayment(rate, loanAmount);
      }
      return {
        resultingRate: rate,
        resultingMonthlyPayment: response.payment,
        resultingMonthlyIOPayment: monthlyIOPayment
      }
    });
  },

  _calculatePMT: function (rate, duration, amount) {
    return new Promise(function (resolve, reject) {
      finance.PMT(amount, duration, ((((parseFloat(rate) * 365.349) / 360) / 12) / 100), 0, function (err, response) {
        if (err) {
          reject({
            isLoanRejected: true
          });
        }
        response = Math.round(response);
        return resolve({
          payment: response
        });
      });
    });
  },

  _calculateIOPayment: function (rate, amount) {
    var response = ((((parseFloat(rate) * 365.349) / 360) / 12) / 100) * amount;
    response = Math.round(response);
    return response;
  },

  calculateAdvance: function (params) {
    return new Promise(function (resolve, reject) {
      resolve({
        resultingRate: 20000,
        resultingMonthlyPayment: 2000
      });
    });
  },

  _calculateTierByProperty: function (type) {
    var propertyTypes = sails.config.app_constants.propertyTypes;
    for (var i = 0; i < propertyTypes.length; i++) {
      if (type == propertyTypes[i].value) {
        return propertyTypes[i].tier;
      }
    }
    return '';
  },

  _calculateLoanToValue: function (loanLookup, propertyPrice, loanAmount, state, creditScore, tier) {
    var loanToValue = (loanAmount * 100) / propertyPrice;

    if (loanToValue <= 50) {
      return 50;
    }

    var ltv = Math.ceil(loanToValue / 5) * 5;

    var upperLimit = loanLookup[tier][creditScore]['max'];
    if (state in sails.config.loan_constants.adjustingStates) {
      upperLimit += sails.config.loan_constants.adjustingStates[state];
    }
    if (loanToValue > upperLimit) {
      return 0;
    }

    return ltv;

  },

  _calculateFixedRateProgram: function (rate, program) {
    try {
      if (program) {
		  console.log("fixedrate",sails.config.loan_constants.fixedRateLookup[program]);
        return rate + sails.config.loan_constants.fixedRateLookup[program];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculateLoanTerm: function (rate, loanTerm) {
    try {
      if (loanTerm) {
        return rate + sails.config.loan_constants.loanTermLookup[loanTerm];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculatePrepaymentFee: function (rate, prepaymentFee) {
    try {
      if (prepaymentFee) {
        return rate + sails.config.loan_constants.prepayFeeLookup[prepaymentFee];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculateInterestOnlyPeriod: function (rate, interestOnly) {
    try {
      if (interestOnly) {
        return rate + sails.config.loan_constants.interestOnlyPeriodLookup[interestOnly];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculatePaymentDay: function (rate, paymentDay) {
    if (!paymentDay || paymentDay == '1') {
      return rate;
    }
    return rate + sails.config.loan_constants.paymentDayLookup['>1'];
  },

  _calculateRateBuydown: function (rate, rateBuydown) {
    try {
      if (rateBuydown) {
        return rate + sails.config.loan_constants.rateBuyDownLookup[rateBuydown];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculateLoanTypeRefiance: function (rate, program,loanToValue) {
    try {
      if (program) {
        rate = rate + sails.config.loan_constants.loanTypes[program];
		if(program=='Cash Out Refinance' && loanToValue >=70) {
		rate =rate + 0.125;	
		}	
		return rate;
      }
      return program;
    } catch (e) {
      return rate;
    }
  },

  _calculateTierOccupancy: function (rate, occupancy, tier) {
    try {
      if (occupancy && tier) {
        return rate + sails.config.loan_constants.occupancyTierLookup[tier][occupancy];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculateDocumentation: function (rate, occupancy, documentation) {
    try {
      if (occupancy && documentation) {
		  if(documentation=='Platinum') {
			 return rate - 0.25; 
		  }	 
		  if(documentation=='Stated') {
			 return rate + 0.375; 
		  }
		   if(documentation=='Silver') {
			 return rate + 0.375; 
		  }
		  if(documentation=='Bank Statement' && occupancy=='owner_occupied') {
			return rate - 0.125; 
		  }		
        return rate + sails.config.loan_constants.documentationLookup[occupancy][documentation];
      }
      return rate;
    } catch (e) {
      return rate;
    }
  },

  _calculateLoanAmountRate: function (rate, loanAmount) {
    if (loanAmount < 250000) {
      return rate + .25;
    }
	if (loanAmount >= 1000000) {
      return rate - 0.250;
    }
    return rate;
  }

};
