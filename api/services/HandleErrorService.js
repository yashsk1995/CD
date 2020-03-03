exports.handle = function (model, validationError) {

  var validationResponse = {};
  var messages = model.validationMessages;
  var validationFields = Object.keys(messages);

  validationFields.forEach(function (validationField) {

    if (validationError[validationField]) {
      var processField = validationError[validationField];
      processField.forEach(function (rule) {
        if (messages[validationField][rule.rule]) {
          validationResponse[validationField] = messages[validationField][rule.rule];
          return validationResponse;
        }
      });
    }
  });
  return validationResponse;
};
