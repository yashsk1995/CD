/**
 * Created by zeeshan on 3/10/2017.
 */

var sf = require('node-salesforce');
var conn = new sf.Connection({
  loginUrl: sails.config.sales_force.url
});

var Rollbar = require("rollbar");
var rollbar = new Rollbar(sails.config.rollbarToken);

module.exports = {

  createOrUpdateLead: function (user, endUser, loanApplication) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;
      conn.login(username, password, function (err, userInfo) {
          if (err) {
            rollbar.log("[SalesForce][CreateUpdateLead][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            return reject({message: 'Unable to connect to server. Contact the administrator'});
          }

          var leadObject = SalesforceMapperService.mapLeadObject(user, endUser, loanApplication);

          var callback = function (err, ret) {
            if (err || !ret.success) {
              console.log(err);
              rollbar.log("[SalesForce][CreateUpdateLead]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
              reject({message: 'Unable to connect to server. Try again later'});
            }
            resolve(ret.id);
          };

          if (leadObject.Id) {
            conn.sobject("Lead").update(leadObject, callback);
          } else {
            _this._getLeadId(leadObject.Email).then(function (leadId) {
              if (leadId) {
                leadObject['Id'] = leadId;
                conn.sobject("Lead").update(leadObject, callback);
              } else {
                conn.sobject("Lead").create(leadObject, callback);
              }
            });
          }
        }
      )
    });
  },

  _getLeadId: function (emailAddress) {
    return new Promise(function (resolve, reject) {
      conn.sobject("Lead").select('ID')
        .where({Email: emailAddress})
        .execute(function (err, records) {
          if (err) {
            rollbar.log("[SalesForce][getLeadId]: " + emailAddress + " | " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            console.log(err);
            reject({message: 'Unable to connect to server. Try again later'});
          }
          if (records.length > 0) {
            resolve(records[0].Id);
          }
          resolve('');
        });
    });
  },

  updateApplicationInfo: function (endUser, applicationUrl, fullApplicationId) {
    var leadObject = {
      Id: endUser.salesForceId
    };
    const customFieldKeys = SalesforceMapperService.customFieldKeys;
    leadObject[customFieldKeys.leadProgress] = endUser.progress;
    if (applicationUrl) {
      leadObject[customFieldKeys.fullApplicationUrl] = applicationUrl;
    }
    if (fullApplicationId) {
      leadObject[customFieldKeys.commercialLoanApplicationId] = fullApplicationId;
    }
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;

      conn.login(username, password, function (err, userInfo) {
        if (err) {
          rollbar.log("[SalesForce][updateApplicationInfo][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
          return reject({message: 'Unable to connect to server. Contact the administrator'});
        }

        conn.sobject("Lead").update(leadObject, function (err, ret) {
          if (err || !ret.success) {
            rollbar.log("[SalesForce][updateApplicationInfo]: " + JSON.stringify(leadObject) + " | " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            console.log(err);
            reject({message: 'Unable to connect to server. Try again later'});
          }
          resolve(ret.id);
        });

      });
    });
  },

  verifyUserPayment: function (user) {
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;

      conn.login(username, password, function (err, userInfo) {
        if (err) {
          rollbar.log("[SalesForce][Payment][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
          return reject({message: 'Unable to connect to server. Contact the administrator'});
        }
        var query = "SELECT id, Is_Payment_Allowed__c, LLC_BI__Amount__c, LLC_BI__Amount_Paid__c, LLC_BI__Amount_Remaining__c " +
          "FROM LLC_BI__Fee__c " +
          "WHERE Is_Payment_Allowed__c = true " +
          "AND LLC_BI__Amount_Remaining__c > 0 " +
          "AND LLC_BI__Loan__c IN (SELECT id FROM LLC_BI__Loan__c where Lead__c='" + user.endUser.salesForceId + "') ";
        conn.query(query, function (err, result) {
          if (err) {
            rollbar.log("[SalesForce][Payment]: " + user.id + " | " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            console.log(err);
            reject({message: 'Unable to connect to SF server. Try again later'});
          }
          if (result.records.length > 0) {
            resolve({id: result.records[0].Id, payableAmount: result.records[0].LLC_BI__Amount_Remaining__c});
          }
          resolve(false);
        });
      });
    });
  },

  updateUserPayment: function (id, amountPaid, paymentType, transactionId) {
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;

      conn.login(username, password, function (err, userInfo) {
        if (err) {
          rollbar.log("[SalesForce][UpdatePayment][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
          return reject({message: 'Unable to connect to SF server. Contact the administrator'});
        }

        var feeObject = {
          Id: id,
          LLC_BI__Amount_Collected__c: amountPaid
        };
        feeObject[customFieldsKeys.paymentType] = paymentType;
        feeObject[customFieldsKeys.paymentTransactionId] = transactionId;

        conn.sobject("LLC_BI__Fee__c").update(feeObject, function (err, ret) {
          if (err || !ret.success) {
            rollbar.log("[SalesForce][UpdatePayment]: " + user.id + " | " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            reject({message: 'Unable to connect to server. Try again later'});
          }
          resolve(ret.id);
        });

      });
    });

  },

  createOrUpdateLoanApplication: function (fullApplication, docusignStatus) {
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;

      conn.login(username, password, function (err, userInfo) {
        if (err) {
          rollbar.log("[SalesForce][FullApplication][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
          return reject({message: 'Unable to connect to server. Contact the administrator'});
        }
        var sfApplication = SalesforceMapperService.mapLoanApplicationObject(fullApplication, docusignStatus);

        var callbacks = function (err, ret) {
          if (err || !ret.success) {
            console.log(err);
            rollbar.log("[SalesForce][FullApplication]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            reject({message: 'Unable to connect to server. Try again later'});
          }
          resolve(ret.id);
        };

        if (sfApplication.Id) {
          conn.sobject("commercial_loan_application__c").update(sfApplication, callbacks);
        } else {
          conn.sobject("commercial_loan_application__c").create(sfApplication, callbacks);
        }
      });
    });
  },

  updateLoanApplicationDocusign: function (fullApplication, docusignStatus) {
    return new Promise(function (resolve, reject) {
      var username = sails.config.sales_force.username;
      var password = sails.config.sales_force.password;

      conn.login(username, password, function (err, userInfo) {
        if (err) {
          rollbar.log("[SalesForce][Docusign][Login]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
          return reject({message: 'Unable to connect to server. Contact the administrator'});
        }
        var sfApplication = SalesforceMapperService.mapDocusignObject(docusignStatus);
        if (fullApplication.sfApplicationId) {
          sfApplication['Id'] = fullApplication.sfApplicationId;
        }
        var callback = function (err, ret) {
          if (err || !ret.success) {
            rollbar.log("[SalesForce][Docusign]: " + JSON.stringify(err) + " | " + (err ? err.toString() : 'null'));
            console.log(err);
            reject({message: 'Unable to connect to server. Try again later'});
          }
          resolve(ret.id);
        };

        conn.sobject("commercial_loan_application__c").update(sfApplication, callback);
      });
    });
  }
};
