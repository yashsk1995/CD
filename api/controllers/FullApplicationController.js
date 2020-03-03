/**
 * ApplicationController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

  _renderForm: function (res, next, step, progress, params, loanApplication, endUser, error, customData) {

    var view = '';
    var noOfCoBorrowers = params && params.noOfCoBorrowers || 0;
    switch (step) {
      case 1:
        view = 'application/personal_info';
        params = params ? params.personalBorrowerInfo || {} : {};
        break;
      case 2:
        view = 'application/loan_request';
        params = params ? params.loanRequest || {} : {};
        break;
      case 3:
        view = 'application/property_info';
        params = params ? params.propertyInfo || {} : {};
        break;
      case 4:
        view = 'application/business_info';
        params = params ? params.businessInfo || {} : {};
        break;
      case 5:
        view = 'application/employment_info';
        params = params ? params.employmentInfo || {} : {};
        break;
      case 6:
        view = 'application/income_expense_info';
        params = params ? params.incomeExpenseInfo || {} : {};
        break;
      case 7:
        view = 'application/assets_liabilities';
        params = params ? params.assetsLiabilities || {} : {};
        break;
      case 8:
        view = 'application/personal_declarations';
        params = params ? params.personalDeclarations || {} : {};
        break;
      case 9:
        view = 'application/business_declarations';
        params = params ? params.businessDeclarations || {} : {};
        break;
      case 10:
        view = 'application/general_authorization';
        params = params ? params.generalAuthorization || {} : {};
        break;
      case 11:
        view = 'application/info_for_monitoring';
        params = params ? params.infoForMonitoring || {} : {};
        break;
      case 12:
        return res.redirect('/application/completed');
    }

    FullApplicationService.getApplicationStatus(endUser.id).then(function (status) {
      return res.view(view, {
        layout: 'application/layout',
        application: params || {},
        noOfCoBorrowers: noOfCoBorrowers || 0,
        loanApplication: loanApplication || {},
        error: error || {},
        step: step,
        progress: progress || 0,
        states: sails.config.app_constants.states,
        lendingStates: sails.config.app_constants.lendingStates,
        amortizations: sails.config.app_constants.amortizations,
        loanPrograms: sails.config.app_constants.loanPrograms,
        loanTypes: sails.config.app_constants.loanTypes,
        prePaymentFees: sails.config.app_constants.prePaymentFee,
        commercialMortgageTypes: sails.config.app_constants.commercialMortgageTypes,
        propertyFacilities: sails.config.app_constants.propertyFacilities,
        propertyTypes: sails.config.app_constants.propertyTypes,
        businessTypes: sails.config.app_constants.businessTypes,
        customData: customData || {},
        endUser: endUser || {},
        status: status
      });
    });
  },

  _renderDBForm: function (req, res, next, step, customData) {
    var userId = req.user.endUser;
    var _this = this;
    var promiseArray = [FullApplicationService.getByEndUser(userId),
      LoanApplicationService.getByEndUser(userId), EndUserService.findById(userId)];

    Promise.all(promiseArray).then(function (response) {
      var application = response[0];
      var loanApplication = response[1];
      var endUser = response[2];

      var progress = application ? application.progress || 1 : 1;
      return _this._renderForm(res, next, step, progress, application, loanApplication, endUser, {}, customData);
    }).catch(function (error) {
      console.log("Full Application Render Error: " + new Date().getTime());
      console.log(error);
      throw error;
    });
  },

  _saveForm: function (req, res, next, params, step, progress) {
    var _this = this;
    params['progress'] = step > progress ? step : progress;
    params['endUser'] = req.user.endUser;

    var updatedApplication = {};
    var updatedUser = {};

    FullApplicationService.createOrUpdate(params.endUser, params).then(function (application) {
      var progress = sails.config.app_constants.user_progress.fullApplicationCompleted;
      if (application.progress < 11) {
        progress = sails.config.app_constants.user_progress.fullApplicationStep + application.progress;
      } else if (application.progress == 11) {
        progress = sails.config.app_constants.user_progress.fullApplicationReview;
      }
      var params = {
        progress: progress
      };
      updatedApplication = application;
      return EndUserService.update(req.user.endUser, params);
    }).then(function (user) {
      updatedUser = user;
      return FullApplicationService.createPDFAndUpload(req, updatedApplication.endUser);
    }).then(function (fileUrl) {
      return SalesForceService.updateApplicationInfo(updatedUser, fileUrl);
    }).then(function (id) {
      return _this._redirect(res, step);
    }).catch(function (error) {
      console.log("Full Application Save Error: " + new Date().getTime());
      console.log(error);
      _this._renderForm(res, next, step, progress, params, {}, {}, error);
    });
  },

  _redirect: function (res, step) {
    switch (step) {
      case 1:
        res.redirect('/application/loan-request');
        break;
      case 2:
        res.redirect('/application/property-info');
        break;
      case 3:
        res.redirect('/application/business-info');
        break;
      case 4:
        res.redirect('/application/employment-info');
        break;
      case 5:
        res.redirect('/application/income-expense-info');
        break;
      case 6:
        res.redirect('/application/assets-liabilities');
        break;
      case 7:
        res.redirect('/application/personal-declarations');
        break;
      case 8:
        res.redirect('/application/business-declarations');
        break;
      case 9:
        res.redirect('/application/general-authorization');
        break;
      case 10:
        res.redirect('/application/info-for-monitoring');
        break;
      case 11:
        res.redirect('/application/review');
        break;
      case 12:
        res.redirect('/application/completed');
        break;
    }
  },

  _getCurrentProgress: function (fullApplication) {
    if (fullApplication) {
      if (!fullApplication.personalBorrowerInfo || !fullApplication.personalBorrowerInfo.isSubmitted) {
        return 0;
      } else if (!fullApplication.loanRequest || !fullApplication.loanRequest.isSubmitted) {
        return 1;
      } else if (!fullApplication.propertyInfo || !fullApplication.propertyInfo.isSubmitted) {
        return 2;
      } else if (!fullApplication.businessInfo || !fullApplication.businessInfo.isSubmitted) {
        return 3;
      } else if (!fullApplication.employmentInfo || !fullApplication.employmentInfo.isSubmitted) {
        return 4;
      } else if (!fullApplication.incomeExpenseInfo || !fullApplication.incomeExpenseInfo.isSubmitted) {
        return 5;
      } else if (!fullApplication.assetsLiabilities || !fullApplication.assetsLiabilities.isSubmitted) {
        return 6;
      } else if (!fullApplication.personalDeclarations || !fullApplication.personalDeclarations.isSubmitted) {
        return 7;
      } else if (!fullApplication.businessDeclarations || !fullApplication.businessDeclarations.isSubmitted) {
        return 8;
      } else if (!fullApplication.generalAuthorization || !fullApplication.generalAuthorization.isSubmitted) {
        return 9;
      } else if (!fullApplication.infoForMonitoring || !fullApplication.infoForMonitoring.isSubmitted) {
        return 10;
      } else {
        return 11;
      }
    } else {
      return 0;
    }
  },

  routeApplication: function (req, res, next) {
    var userId = req.user.endUser;
    var _this = this;
    FullApplicationService.getByEndUser(userId).then(function (application) {
      var progress = _this._getCurrentProgress(application);
      if (progress >= 11) {
        return _this._redirect(res, progress);
      }
      return _this._renderDBForm(req, res, next, progress + 1);
    }).catch(function (error) {
      console.log(error);
      next({message: 'Unable to proceed Try Again Later'});
    });
  },

  startApplication: function (req, res, next) {
    var endUser = {
      progress: sails.config.app_constants.user_progress.startedFullApplication
    };

    return EndUserService.update(req.user.endUser, endUser).then(function (updatedEndUser) {
      return SalesForceService.updateApplicationInfo(updatedEndUser);
    }).then(function (response) {
      res.redirect('/application');
    }).catch(function (error) {
      console.log(error);
      next(error);
    });


  },

  renderPersonalInfo: function (req, res, next) {
    this._renderDBForm(req, res, next, 1);
  },

  savePersonalInfo: function (req, res, next) {
    var coBorrowerCount = 0;
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      entityInformation: reqParams.entityInformation
    };
    if (reqParams.entityInformation == sails.config.app_constants.application_entity_types.Entity) {
      if (reqParams.individualName) {
        var individuals = [];
        if (Array.isArray(reqParams.individualName)) {
          for (var i = 0; i < reqParams.individualName.length; i++) {
            individuals.push({
              individualName: reqParams.individualName[i],
              individualEmail: reqParams.individualEmail[i],
              ownership: reqParams.ownership[i],
              onTitle: reqParams.onTitle[i]
            });
          }
        } else {
          individuals.push({
            individualName: reqParams.individualName,
            individualEmail: reqParams.individualEmail,
            ownership: reqParams.ownership,
            onTitle: reqParams.onTitle
          });
        }
        coBorrowerCount = individuals.length - 1;
        delete reqParams.individualName;
        delete reqParams.individualEmail;
        delete reqParams.ownership;
        delete reqParams.onTitle;
        reqParams['individuals'] = individuals;
      }
    } else {
      if (reqParams.coBorrowerName) {
        var coBorrowers = [];
        if (Array.isArray(reqParams.coBorrowerName)) {

          for (var i = 0; i < reqParams.coBorrowerName.length; i++) {
            coBorrowers.push({
              coBorrowerName: reqParams.coBorrowerName[i],
              coBorrowerEmail: reqParams.coBorrowerEmail[i],
              coBorrowerAddress: reqParams.coBorrowerAddress[i],
              coBorrowerCity: reqParams.coBorrowerCity[i],
              coBorrowerState: reqParams.coBorrowerState[i]
            });
          }
        } else {
          coBorrowers.push({
            coBorrowerName: reqParams.coBorrowerName,
            coBorrowerEmail: reqParams.coBorrowerEmail,
            coBorrowerAddress: reqParams.coBorrowerAddress,
            coBorrowerCity: reqParams.coBorrowerCity,
            coBorrowerState: reqParams.coBorrowerState
          });
        }
        coBorrowerCount = coBorrowers.length;
        delete reqParams.coBorrowerName;
        delete reqParams.coBorrowerEmail;
        delete reqParams.coBorrowerAddress;
        delete reqParams.coBorrowerCity;
        delete reqParams.coBorrowerState;
        reqParams['coBorrowers'] = coBorrowers;
      }
    }
    params['noOfCoBorrowers'] = coBorrowerCount;
    params['personalBorrowerInfo'] = reqParams;
    this._saveForm(req, res, next, params, 1, progress);
  },

  renderLoanRequest: function (req, res, next) {
    this._renderDBForm(req, res, next, 2);
  },

  saveLoanRequest: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      loanRequest: reqParams
    };
    this._saveForm(req, res, next, params, 2, progress);
  },

  renderPropertyInfo: function (req, res, next) {
    this._renderDBForm(req, res, next, 3);
  },

  savePropertyInfo: function (req, res, next) {
    var _this = this;
    var progress = req.param('progress') || 0;
    var propertyFile = req.file('propertyFile');
    var reqParams = req.allParams();
    delete reqParams.progress;

    FileUploadService.uploadToS3(propertyFile, reqParams.propertyFileUrl).then(function (filePath) {
      reqParams['propertyFileUrl'] = filePath;
      var params = {
        propertyInfo: reqParams
      };
      return _this._saveForm(req, res, next, params, 3, progress);
    }).catch(function (err) {
      _this._renderForm(res, next, 3, progress, reqParams, {}, {}, err);
    });
  },

  renderBusinessInfo: function (req, res, next) {
    this._renderDBForm(req, res, next, 4);
  },

  saveBusinessInfo: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;

    var params = {
      businessInfo: reqParams
    };
    this._saveForm(req, res, next, params, 4, progress);
  },

  renderEmploymentInfo: function (req, res, next) {
    this._renderDBForm(req, res, next, 5);
  },

  saveEmploymentInfo: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      employmentInfo: reqParams
    };
    this._saveForm(req, res, next, params, 5, progress);
  },

  renderIncomeExpenseInfo: function (req, res, next) {

    this._renderDBForm(req, res, next, 6);
  },

  saveIncomeExpenseInfo: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      incomeExpenseInfo: reqParams
    };
    this._saveForm(req, res, next, params, 6, progress);
  },

  renderAssetsLiabilities: function (req, res, next) {
    this._renderDBForm(req, res, next, 7);
  },

  saveAssetsLiabilities: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      assetsLiabilities: reqParams
    };
    this._saveForm(req, res, next, params, 7, progress);
  },

  renderPersonalDeclarations: function (req, res, next) {
    this._renderDBForm(req, res, next, 8);
  },

  savePersonalDeclarations: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      personalDeclarations: reqParams
    };
    this._saveForm(req, res, next, params, 8, progress);
  },

  renderBusinessDeclarations: function (req, res, next) {
    this._renderDBForm(req, res, next, 9);
  },

  saveBusinessDeclarations: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      businessDeclarations: reqParams
    };
    this._saveForm(req, res, next, params, 9, progress);
  },

  renderGeneralAuthorization: function (req, res, next) {
    this._renderDBForm(req, res, next, 10);

  },

  saveGeneralAuthorization: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    var _this = this;

    var generalAuth = {
      generalAuthorization: reqParams
    };

    this._saveForm(req, res, next, generalAuth, 10, progress);
  },

  renderInfoForMonitoring: function (req, res, next) {
    this._renderDBForm(req, res, next, 11);
  },

  saveInfoForMonitoring: function (req, res, next) {
    var progress = req.param('progress') || 0;
    var reqParams = req.allParams();
    delete reqParams.progress;
    var params = {
      infoForMonitoring: reqParams
    };
    this._saveForm(req, res, next, params, 11, progress);
  },

  renderCompleted: function (req, res) {
    res.view('application/completed');
  },


  renderReviewApplication: function (req, res) {
    var userId = req.user.endUser;
    return FullApplicationService.getByEndUser(userId).then(function (application) {
      return res.view('application/full_application_preview', {app: application, layout: ''});
    }).catch(function (error) {
      throw error;
    });
  },

  submitApplication: function (req, res) {
    var userId = req.user.endUser;
    return FullApplicationService.crateCommercialLoanApplication(userId).then(function (application) {
      res.redirect("/application/completed");
    }).catch(function (error) {
      res.redirect("/application/review");
    });
  }


};

