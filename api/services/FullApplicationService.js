/**
 * Created by zeeshan on 3/1/2017.
 */
var wkhtmltopdf = require('wkhtmltopdf');

module.exports = {

  create: function (params) {
    return FullApplication.create(params).then(function (application) {
      return application;
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(FullApplication, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  update: function (id, params) {
    return FullApplication.update({id: id}, params).then(function (updatedApplication) {
      return updatedApplication[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(FullApplication, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  updateSfApplicationId: function (id, sfApplicationId) {
    return FullApplication.update({id: id}, {sfApplicationId: sfApplicationId}).then(function (updatedApplication) {
      return updatedApplication[0];
    }).catch(function (err) {
      if (err.ValidationError) {
        var handledError = HandleErrorService.handle(FullApplication, err.ValidationError);
        throw handledError;
      }
      throw err;
    });
  },

  createOrUpdate: function (userId, params) {
    var _this = this;
    return FullApplication.findOne({endUser: userId}).then(function (application) {
      if (application) {
        return _this.update(application.id, params);
      } else {
        return _this.create(params);
      }
    });
  },

  getByEndUser: function (userId) {
    return FullApplication.findOne({endUser: userId}).then(function (application) {
      console.log("Full Application Service: Get by EndUser:");
      //console.log(application);
      if(application){
        return application;
      }
      return {};
    });
  },

  getById: function (id) {
    return FullApplication.findOne({id: id}).then(function (application) {
      return application;
    });
  },

  // Wrote callback because promise can resolve stream
  createPDFAndUpload: function (req, endUserId) {
    return new Promise(function (resolve, reject) {
      var pageURL = sails.config.print_url + '/print/application/' + endUserId;
      wkhtmltopdf(pageURL, {pageSize: 'a4'}, function (err, stream) {
        if (err) {
          return reject(err);
        }
        FileUploadService.uploadS3Stream(stream, function (err, response) {
          if (err) {
            return reject(err);
          }
          return resolve(response);
        });
      });
    });
  },

  crateCommercialLoanApplication: function (endUserId) {
    var fullApplication;
    var _this = this;

    return this.getByEndUser(endUserId).then(function (application) {
      fullApplication = application;
      return DocusignStatusService.findByEndUser(endUserId);
    }).then(function (docusignStatus) {
      return SalesForceService.createOrUpdateLoanApplication(fullApplication, docusignStatus);
    }).then(function (response) {
      return _this.updateSfApplicationId(fullApplication.id, response);
    }).then(function (updatedApplication) {
      fullApplication = updatedApplication;
      var endUser = {
        progress: sails.config.app_constants.user_progress.fullApplicationCompleted
      };
      return EndUserService.update(endUserId, endUser);
    }).then(function (updatedEndUser) {
      return SalesForceService.updateApplicationInfo(updatedEndUser, false, fullApplication.sfApplicationId);
    }).then(function (sfApplicationId) {
      return FullApplicationService.update(fullApplication.id, {progress: 12});
    });
  },

  getApplicationStatus: function (endUserId) {
    return this.getByEndUser(endUserId).then(function (application) {
      if(application){
        return {
          personalBorrowerInfo: application.personalBorrowerInfo && application.personalBorrowerInfo.isSubmitted || false,
          loanRequest: application.loanRequest && application.loanRequest.isSubmitted || false,
          propertyInfo: application.propertyInfo && application.propertyInfo.isSubmitted || false,
          businessInfo: application.businessInfo && application.businessInfo.isSubmitted || false,
          employmentInfo: application.employmentInfo && application.employmentInfo.isSubmitted || false,
          incomeExpenseInfo: application.incomeExpenseInfo && application.incomeExpenseInfo.isSubmitted || false,
          assetsLiabilities: application.assetsLiabilities && application.assetsLiabilities.isSubmitted || false,
          personalDeclarations: application.personalDeclarations && application.personalDeclarations.isSubmitted || false,
          businessDeclarations: application.businessDeclarations && application.businessDeclarations.isSubmitted || false,
          generalAuthorization: application.generalAuthorization && application.generalAuthorization.isSubmitted || false,
          infoForMonitoring: application.infoForMonitoring && application.infoForMonitoring.isSubmitted || false,
        };
      }else{
        return {
          personalBorrowerInfo: false,
          loanRequest: false,
          propertyInfo:false,
          businessInfo:false,
          employmentInfo: false,
          incomeExpenseInfo: false,
          assetsLiabilities: false,
          personalDeclarations: false,
          businessDeclarations: false,
          generalAuthorization: false,
          infoForMonitoring: false
        };
      }
    });
  }

};
