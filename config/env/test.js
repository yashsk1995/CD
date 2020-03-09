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

  port: 1339,

  app_url: 'http://localhost:1337',

  print_url: 'http://localhost:1337',

  homepage_url: 'http://localhost:1337',

  models: {
    connection: 'commercialDirectDBTest',
    migrate: 'drop'
  },

  elastic_search: {
    host: 'localhost:9200',
    index: 'commercial_direct_test',
    log: 'error'
  },

  email: {
    from: 'no-reply@commercialdirect.com'
  },

  aws: {
    accessKeyId: 'AKIAJFQFD4F3ZJIHC3NA',
    secretAccessKey: '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',
    region: 'https://email.us-west-2.amazonaws.com',
    s3Bucket: 'cd-com-staging'
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
    mode:'sandbox', //sandbox or live
    clientId: 'AZZ4_dXOEwvsvw4cq0tTYz0RzWlA_y3wv0eY_l1c6qlc_QrNDagJrOG5mRAHg79_z1NcE9bbUVyfUgcF',
    secretKey: 'EOntp2Lc1EvZAgi--6HBFN8ziHSfe2mocKYe9YhzOasOdgi6nBEE4mOovqZTnF--w1zDqx4UOCJP5vID'
  },

  docusign: {
    apiUrl : 'https://demo.docusign.net/restapi/v2/login_information',
    integratorKey: 'acad4a62-5ebb-4531-b66d-a74e0490895e',
    email: 'zeeshan.abbas@tkxel.com',                     // Email for your DocuSign Account
    password: 'commercial_direct',
    templateId: '6329536d-aba1-48d8-8b49-2c7f0de9a9da',
    callbackUrl:'/docusign-success',
    wehhookUrl: '/docusign-update',
    emailSubject: 'Commercial Direct Agreement',
    roles: ['Borrower', 'CoBorrower', 'CoBorrower2', 'CoBorrower3'] // This has to be in sequence from borrower to coborrower 3
  },

  rollbarToken: 'dd75b283713c483ea330635104a3994d'


};
