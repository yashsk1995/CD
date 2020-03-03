/**
 * Created by zeeshan on 3/1/2017.
 */
module.exports = {


  create: function (params) {
    return LoanApplication.create(params).then(function (loan) {
      return loan;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(LoanApplication, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  update: function (id, params) {
    return LoanApplication.update({id: id}, params).then(function (updatedLoan) {
      return updatedLoan[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(LoanApplication, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  createOrUpdate: function (params) {
    var _this = this;
    params.propertyPrice = _this._parseCurrency(params.propertyPrice);
    params.loanAmount = _this._parseCurrency(params.loanAmount);
    if(params.id) {
      return LoanApplication.findOne({id: params.id}).then(function (respose) {
        if (respose) {
          return _this.update(params.id, params);
        } else {
          return _this.create(params);
        }
      });
    }
    else {
      return _this.create(params);
    }
  },

  _parseCurrency: function(value) {
    if(value && typeof(value) == 'string') {
      var a = value.replace(/,/g, "");
      var s = parseInt(a);
      return s;
    }
    else {
      return value;
    }
  },

  getById: function (id) {
    return LoanApplication.findOne({id: id}).then(function (loanApplication) {
      return loanApplication;
    });
  },

  getByEndUser: function (endUser) {
    return LoanApplication.findOne({endUser: endUser}).then(function (loanApplication) {
      return loanApplication;
    });
  }
};
