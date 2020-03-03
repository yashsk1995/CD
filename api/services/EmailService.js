/**
 * Created by zeeshan on 3/10/2017.
 */

var ses = require('node-ses-any-promise');

var client = ses.createClient({
  key: sails.config.aws.accessKeyId,
  secret: sails.config.aws.secretAccessKey,
  amazon: sails.config.aws.region
});

module.exports = {

  sendEmail: function (to, subject, message) {
    if (sails.config.environment == 'development' || sails.config.environment == 'test') {
      to = 'info@pllay.co';
    }
    return client.sendEmail({
      to: to,
      from: sails.config.email.from,
      subject: subject,
      message: message
    }).then(function (data) {
      //console.log(data)
      return data;
    }).catch(function (err) {
      throw err;
    });
  },

  sendWelcomeEmail: function (user, password) {
    var text = "Hi,<br/><br/> Welcome to Commercial Direct!  We want to learn more about you and your financing needs, so please use the following password to continue the application process: <br/><br/>" + password + " <br/><br/> Have a question?  Don’t hesitate to contact us at 855-484-5352 or info@shf-commercialdirect.com.";
    return this.sendEmail(user.email, "Welcome to Commercial Direct", text);
  },

  sendWelcomeEmailMiniAppSimple: function (user, password) {
    var text = "Hello there,<br/><br/>Thanks for your submission!<br/><br/>Did you know? When you downloaded your " +
      "free guide, you also made it easier to apply with Commercial Direct and get a commercial mortgage on your own terms." +
      "<br/><br/>If you’ve never customized a loan request with us before, simply visit our Loan Customizer page and select " +
      "“Continue Existing Application.”  You’ll be prompted to enter your email address and the following password:<br/>" +
      password + '<br/><br/>From there, you can complete your loan application.  A Commercial Direct representative will ' +
      'then reach out with pre-approval confirmation.<br/><br/>Have a question?  Don’t hesitate to contact us at 855-484-5352 ' +
      'or info@shf-commercialdirect.com.<br/><br/>Thanks,<br/><br/>Commercial Direct Team';
    return this.sendEmail(user.email, "Welcome to Commercial Direct", text);
  },

  sendForgotPasswordEmail: function (req, user, token) {
    var url = sails.config.app_url + '/reset-password/' + token;
    var text = "Hi " + user.name + ",\nPlease use the following link to reset your password.\n" + url;
    return this.sendEmail(user.email, "Password Reset", text);
  },

  contactRequest: function (data) {
    var to = sails.config.email.contact || '';
    var subject = "Contact Request";
    var text = "Hi, <br/> A new contact request has been recieved. Details are as follows, <br/>  Name: " + data.name + '<br/> Email:  ' + data.email + ' <br/> Phone: ' + data.phone;
    return this.sendEmail(to, subject, text);
  },

  sendLeadConfirm: function (user, phoneNumber, loanApplication) {
    var to = sails.config.email.new_lead || '';
    var subject = "Lead Confirmation - New Lead";
    var text = 'Hi,<br/> <br/> We have a confirmation of a new lead. Details are as follows, <br/><br/>'
      + '<br/> User Name: ' + user.name + '<br/>'
      + '<br/> Email: ' + user.email + '<br/>'
      + '<br/> Phone: ' + (phoneNumber || "NA") + '<br/>'
      + '<br/> Loan Type: ' + loanApplication.loanType + '<br/>'
      + '<br/> Property Type: ' + loanApplication.propertyType + '<br/>'
      + '<br/> Property Price: ' + loanApplication.propertyPrice + '<br/>'
      + '<br/> Loan Amount: ' + loanApplication.loanAmount + '<br/>'
      + '<br/> Credit Score: ' + loanApplication.creditScore + '<br/>'
      + '<br/> Property Adress: ' + (loanApplication.propertyCity || '') + " , " + loanApplication.propertyState + '<br/>'
      + '<br/> Property Occupancy: ' + (loanApplication.propertyOccupancy || '') + '<br/>'
      + '<br/> Fixed Rate Period: ' + (loanApplication.program || '') + ' Years' + '<br/>'
      + '<br/> Loan Term: ' + (loanApplication.amortizationTerm || '') + ' Years' + '<br/>'
      + '<br/> Interest Only Period: ' + (loanApplication.interestOnlyPeriodMonths || '') + ' Months' + '<br/>'
      + '<br/> Rate Buydown: ' + (loanApplication.rateBuyDown || '') + ' Point(s)' + '<br/>'
      + '<br/> Documentation: ' + (loanApplication.documentation || '') + '<br/>'
      + '<br/> Resulting Rate: ' + (loanApplication.resultingRate || '') + '<br/>'
      + '<br/> Payment Date: ' + (loanApplication.paymentDay || 0) + '<br/>'
      + '<br/> PrePayment: 5% for ' + (loanApplication.prepayPenalty || 0) + " years" + '<br/>'
      + '<br/> Resulting Monthly Payment: ' + (loanApplication.resultingMonthlyPayment || 0) + '<br/>'
      + '<br/> Resulting Monthly IO Payment: ' + (loanApplication.resultingMonthlyIOPayment || 0 ) + '<br/>';
    return this.sendEmail(to, subject, text);
  },

  sendLeadConfirmSimple: function (name, email, phoneNumber, landingPage) {
    var to = sails.config.email.new_lead || '';
    var subject = "Lead Confirmation - New Simple Lead";
    var text = 'Hi,<br/> <br/> We have a confirmation of a new lead. Details are as follows, <br/><br/>'
      + '<br/> User Name: ' + name + '<br/>'
      + '<br/> Email: ' + email + '<br/>'
      + '<br/> Phone: ' + (phoneNumber || "NA") + '<br/>'
      + '<br/> Landing Page: ' + landingPage + '<br/>';
    return this.sendEmail(to, subject, text);
  },


};
