module.exports = {
  create: function (params) {
    return DocusignStatus.create(params).then(function (post) {
      return post;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(DocusignStatus, err.ValidationError);
        throw handledError;
      }
      throw {message: err.details};
    });
  },

  update: function (params, id) {
    return DocusignStatus.update({id: id}, params);
  },

  findByEnvelopeId: function (envelopeId) {
    return DocusignStatus.findOne({envelopeId: envelopeId});
  },

  findByEndUser: function (id) {
    return DocusignStatus.findOne({endUser: id});
  },


  findByFullApplication: function (id) {
    return DocusignStatus.findOne({fullApplication: id});
  },

  updateByEndUser: function (params, id) {
    return DocusignStatus.update({endUser: id}, params);
  }

};
