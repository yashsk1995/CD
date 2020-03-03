var docusign = require('docusign-esign');
var request = require("request");

module.exports = {

  createEnvelope: function (fullApplication, endUser) {
    var _this = this;
    var recipients = this._mapApplicationToRecipient(fullApplication, true);
    var baseUrl, envelopeId;
    return this._getBaseUrl().then(function (url) {
      baseUrl = url;
      return _this._sendCreateEnvelopeRequest(baseUrl, recipients, fullApplication.id);
    }).then(function (id) {
      envelopeId = id;
      var status = {
        envelopeId: envelopeId,
        endUser: endUser,
        fullApplication: fullApplication
      };
      return DocusignStatusService.create(status);
    }).then(function (docuSignStatus) {
      return _this._getSigningUrl(baseUrl, envelopeId, recipients[0]);
    }).catch(function (error) {
      console.log(error);
      throw error;
    });
  },

  createSigningSession: function (fullApplication, envelopeId) {
    var _this = this;
    return this._getBaseUrl().then(function (baseUrl) {
      var recipients = _this._mapApplicationToRecipient(fullApplication);
      return _this._getSigningUrl(baseUrl, envelopeId, recipients[0]);
    });
  },

  getEnvelopeStatus: function (envelopeId) {
    var _this = this;
    return this._getBaseUrl().then(function (baseUrl) {
      return _this._sendEnvelopeStatusRequest(baseUrl, envelopeId);
    }).then(function (envelopeStatus) {
      return _this._mapToDocusignStatus(envelopeId, envelopeStatus);
    });
  },

  _getBaseUrl: function () {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var url = sails.config.docusign.apiUrl;
      var body = "";	// no request body for login api call

      var options = _this._initializeRequest(url, "GET", body);
      request(options, function (err, res, body) {
        if (!_this._parseResponseBody(err, res, body)) {
          reject("Authentication Error");
        }
        var baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
        resolve(baseUrl)
      });
    });
  },

  _getSigningUrl: function (baseUrl, envelopeId, recipient) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";

      var body = JSON.stringify({
        returnUrl: sails.config.app_url + sails.config.docusign.callbackUrl,
        authenticationMethod: "email",
        email: recipient.email,
        userName: recipient.name,
        clientUserId: recipient.clientUserId	// must match clientUserId in step 2!
      });

      var options = _this._initializeRequest(url, "POST", body);
      request(options, function (err, res, body) {
        if (!_this._parseResponseBody(err, res, body)) {
          reject("Error occured");
        }
        else {
          var resp = JSON.parse(body);
          console.log("\nNavigate to the above URL to start the Embedded Signing workflow...");
          resolve(resp.url);
        }
      });
    });
  },

  _sendCreateEnvelopeRequest: function (baseUrl, recipients, appId) {
    var _this = this;
    var notificationEvent = _this._getEventNotification(appId);
    return new Promise(function (resolve, reject) {
      var body = JSON.stringify({
        emailSubject: sails.config.docusign.emailSubject,
        templateId: sails.config.docusign.templateId,
        templateRoles: recipients,
        eventNotification: notificationEvent,
        status: "sent"
      });

      var url = baseUrl + "/envelopes";
      var options = _this._initializeRequest(url, "POST", body);
      request(options, function (err, res, body) {
        if (!_this._parseResponseBody(err, res, body)) {
          reject("Envelope creation error.")
        }
        var envelopeId = JSON.parse(body).envelopeId;
        resolve(envelopeId);
      });
    });
  },

  _sendEnvelopeStatusRequest: function (baseUrl, envelopeId) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var url = baseUrl + "/envelopes/" + envelopeId + '/recipients';
      var body = "";
      // set request url, method, body, and headers
      var options = _this._initializeRequest(url, "GET", body);
      request(options, function (err, res, body) {
        if (!_this._parseResponseBody(err, res, body)) {
          reject(err)
        }
        else {
          var resp = JSON.parse(body);
          console.log("Envelop Response ", resp);
          resolve(resp);
        }
      });
    });
  },

  _getEventNotification: function (appId) {
    var recipientEvents = [];
    var recipientEvent = new docusign.RecipientEvent();
    recipientEvent.recipientEventStatusCode = "Completed";
    recipientEvents.push(recipientEvent);

    var eventNotification = new docusign.EventNotification();
    eventNotification.url = sails.config.app_url + sails.config.docusign.wehhookUrl + "?id=" + appId;
    eventNotification.LoggingEnabled = true;
    eventNotification.includeDocumentFields = true;
    eventNotification.loggingEnabled = true;
    eventNotification.recipientEvents = recipientEvents;
    // eventNotification.envelopeEvents = envelopeEvent;
    return eventNotification;
  },

  /////////////////////////////////////////////////////////////////////////////////////////////// Helper Method


  _mapApplicationToRecipient: function (fullApplication, isMapCoBorrowers) {
    var personalInfo = fullApplication.personalBorrowerInfo;
    var recipientRoles = sails.config.docusign.roles;

    var recipients = [];
    if (personalInfo.entityInformation === sails.config.app_constants.application_entity_types.Entity) {
      if(personalInfo.individuals) {
        for (var i = 0; i < personalInfo.individuals.length || (i < 1 && !isMapCoBorrowers); i++) {
          var recipient = {
            email: personalInfo.individuals[i].individualEmail,
            name: personalInfo.individuals[i].individualName,
            roleName: recipientRoles[i]
          };
          if (i == 0) {
            recipient["clientUserId"] = "1001";
          }
          recipients.push(recipient);
        }
      }    
    } else if (personalInfo.entityInformation === sails.config.app_constants.application_entity_types.Personal) {
      recipients.push({
        email: personalInfo.emailAddress,
        name: personalInfo.borrowerName,
        roleName: recipientRoles[0],
        clientUserId: "1001"
      });
      if(personalInfo.coBorrowers) { 
        for (var i = 0; i < personalInfo.coBorrowers.length; i++) {
          recipients.push({
            name: personalInfo.coBorrowers[i].coBorrowerName,
            email: personalInfo.coBorrowers[i].coBorrowerEmail,
            roleName: recipientRoles[i + 1]
          });
        }
      }
    }
    return recipients;
  },

  _initializeRequest: function (url, method, body) {
    var options = {
      "method": method,
      "uri": url,
      "body": body,
      "headers": {}
    };
    this._addRequestHeaders(options);
    return options;
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  _addRequestHeaders: function (options) {
    // JSON formatted authentication header (XML format allowed as well)
    dsAuthHeader = JSON.stringify({
      "Username": sails.config.docusign.email,
      "Password": sails.config.docusign.password,
      "IntegratorKey": sails.config.docusign.integratorKey	// global
    });
    // DocuSign authorization header
    options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////
  _parseResponseBody: function (err, res, body) {
    console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
    if (res.statusCode != 200 && res.statusCode != 201) { // success statuses
      console.log("Error calling webservice, status is: ", res.statusCode);
      console.log("\r\n", err);
      return false;
    }
    return true;
  },

  _mapToDocusignStatus: function (envelopeId, recipients) {
    if (recipients.signers) {
      var status = {envelopeId: envelopeId};
      for (var i = 0; i < recipients.signers.length; i++) {
        var signer = recipients.signers[i];
        if (signer.status.toLowerCase() == "completed") {
          if (signer.roleName.toLowerCase() == sails.config.docusign.roles[0].toLowerCase()) {
            status['hasBorrowerSigned'] = true;
          } else if (signer.roleName.toLowerCase() == sails.config.docusign.roles[1].toLowerCase()) {
            status['hasCoBorrowerSigned'] = true;
          } else if (signer.roleName.toLowerCase() == sails.config.docusign.roles[2].toLowerCase()) {
            status['hasCoBorrower2Signed'] = true;
          } else if (signer.roleName.toLowerCase() == sails.config.docusign.roles[3].toLowerCase()) {
            status['hasCoBorrower3Signed'] = true;
          }
        }
      }
      return status;
    }
    return {};

  }

};
