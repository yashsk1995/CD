/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  models: {
    connection: 'commercialDirectDBLocal',
    migrate: 'alter'
  },

  app_url: 'http://localhost:1337',

  print_url: 'http://localhost:1337',

  homepage_url: '',

  elastic_search: {
    host: 'localhost:9200',
    index: 'commercial_direct',
    log: 'error'
  },

  email: {
    from: 'jonatan@pllay.co', //'no-reply@commercialdirect.com'
    contact: 'info@pllay.co',
    new_lead: 'info@pllay.co'
  },

  

  sales_force: {
    url: 'https://test.salesforce.com',
    username: 'jonatan@pllay.co.pcsandbox',
    password: 'Password2018!ACLmr3QRkzufHCkRYUWiEYPta',
    record_type_id: '01237000000Xwl3',
    company: 'Commercial Direct',
    status: 'Sales Qualified'
  },

  paypal: {
    mode: 'sandbox', //sandbox or live
    clientId: 'AZZ4_dXOEwvsvw4cq0tTYz0RzWlA_y3wv0eY_l1c6qlc_QrNDagJrOG5mRAHg79_z1NcE9bbUVyfUgcF',
    secretKey: 'EOntp2Lc1EvZAgi--6HBFN8ziHSfe2mocKYe9YhzOasOdgi6nBEE4mOovqZTnF--w1zDqx4UOCJP5vID'
  },

  docusign: {
    apiUrl: 'https://demo.docusign.net/restapi/v2/login_information',
    integratorKey: '58e0744f-a49f-425b-9b0f-0611130979d4',
    email: 'jonatan@pllay.co',                     // Email for your DocuSign Account
    password: 'Password1!',
    templateId: '35851f18-64c7-4f45-9a47-d713abd0b3c0',
    callbackUrl: '/docusign-success',
    wehhookUrl: '/docusign-update',
    emailSubject: 'Commercial Direct Agreement',
    roles: ['Guarantor 1', 'Guarantor 2', 'Guarantor 3', 'Guarantor 4'] // This has to be in sequence from borrower to coborrower 3
  },

  // docusign: {
  //   apiUrl: 'https://na2.docusign.net/restapi/v2/login_information',
  //   integratorKey: '58e0744f-a49f-425b-9b0f-0611130979d4',
  //   email: 'jonatan@pllay.co',                     // Email for your DocuSign Account
  //   password: 'Password1!',
  //   templateId: '87C40288-496C-4E73-90E1-DB8FDA048E1C',
  //   callbackUrl: '/docusign-success',
  //   wehhookUrl: '/docusign-update',
  //   emailSubject: 'Commercial Direct Agreement',
  //   roles: ['Guarantor 1', 'Guarantor 2', 'Guarantor 3', 'Guarantor 4'] // This has to be in sequence from borrower to coborrower 3
  // },


  rollbarToken: 'dd75b283713c483ea330635104a3994d'


};
