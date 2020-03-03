/**
 * DocusignController
 *
 * @description :: Server-side logic for displaying docusign document
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getDocusignUrl: function (req, res, next) {
    var userId = req.user.endUser;
    var fullApplication;

    FullApplicationService.getByEndUser(userId).then(function (resApplication) {
      fullApplication = resApplication;
      return DocusignStatusService.findByEndUser(userId);
    }).then(function (docusignStatus) {
      if (docusignStatus) {
        if (docusignStatus.hasBorrowerSigned) {
          return {isSigned: true}
        } else {
          return DocusignApiService.createSigningSession(fullApplication, docusignStatus.envelopeId);
        }
      } else {
        return DocusignApiService.createEnvelope(fullApplication, userId);
      }

    }).then(function (response) {
      var data = response;
      if (!response.isSigned) {
        data = {
          docusignUrl: response
        }
      }
      res.send({
        status: 'success',
        data: data
      });
    }).catch(function (error) {
      res.send({
        status: 'failed',
        error: 'Unable to send request'
      });
    });
  },


  saveDocusignStatus: function (req, res, next) {
    var userId = req.user.endUser;
    DocusignStatusService.updateByEndUser({hasBorrowerSigned: true}, userId).then(function (updatedStatus) {
      res.view('application/docusign-success', {layout: ''});
    })
  },

  handleWebhook: function (req, res, next) {
    console.log(JSON.stringify(req.body));
    var appId = req.param("id");
    var docusignStatus;
    if (appId) {
      DocusignStatusService.findByFullApplication(appId).then(function (status) {
        docusignStatus = status;
        if (docusignStatus) {
          return DocusignApiService.getEnvelopeStatus(docusignStatus.envelopeId);
        }
        return false;
      }).then(function (apiDocusignStatus) {
        if (apiDocusignStatus) {
          return DocusignStatusService.update(apiDocusignStatus, docusignStatus.id);
        }
        return false;
      }).then(function (status) {
        if (status) {
          docusignStatus = status[0];
          return FullApplicationService.getById(appId);
        }
        return false;
      }).then(function (fullApplication) {
        if (fullApplication && fullApplication.sfApplicationId) {
          return SalesForceService.updateLoanApplicationDocusign(fullApplication, docusignStatus);
        }
        return false;
      }).then(function (response) {
        console.log("Webhook Response");
        console.log(response);
        res.send({})
      }).catch(function (err) {
        console.log("Webhook Error");
        console.log(err);
        res.send({});
      })
    }

  }

};
