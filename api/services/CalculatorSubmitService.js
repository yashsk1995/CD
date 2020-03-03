/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {
  create: function (params) {
    return CalculatorSubmit.create(params).then(function (calcsubmit) {
      return calcsubmit;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(CalculatorSubmit, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },

  update: function (id, params) {
    return CalculatorSubmit.update({id: id}, params).then(function (updatedCalcSubmit) {
      return updatedCalcSubmit[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(CalculatorSubmit, err.ValidationError)
        throw handledError;
      }
      throw err;
    });
  },
};
