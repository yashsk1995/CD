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
    connection: 'commercialDirectDBStaging'
  },

  app_url: process.env.app_url,

  print_url: process.env.print_url,

  homepage_url: process.env.homepage_url,

  elastic_search: {
    host: process.env.es_host,
    index: process.env.es_index,
    log: process.env.es_log
  },

  email: {
    from: process.env.from_email,
    contact: process.env.contact_email,
    new_lead: process.env.new_lead_email
  },

  aws: {
    accessKeyId: process.env.ses_key_id,
    secretAccessKey: process.env.ses_access_key,
    region: 'https://email.us-west-2.amazonaws.com',
    s3Bucket: 'cd-com-staging'
  },

  sales_force: {
    url: process.env.sf_url,
    username: process.env.sf_username,
    password: process.env.sf_password,
    record_type_id: process.env.sf_recordtype,
    company: process.env.sf_company, //'Commercial Direct',
    status: process.env.sf_status //'Sales Qualified'
  },

  paypal: {
    mode: process.env.pp_mode, //'sandbox', //sandbox or live
    clientId: process.env.pp_client_id,//'AZZ4_dXOEwvsvw4cq0tTYz0RzWlA_y3wv0eY_l1c6qlc_QrNDagJrOG5mRAHg79_z1NcE9bbUVyfUgcF',
    secretKey: process.env.pp_secret_key//'EOntp2Lc1EvZAgi--6HBFN8ziHSfe2mocKYe9YhzOasOdgi6nBEE4mOovqZTnF--w1zDqx4UOCJP5vID'
  },

  docusign: {
    apiUrl: process.env.docusign_api_url, //'https://demo.docusign.net/restapi/v2/login_information',
    integratorKey: process.env.docusign_integrator_key, //'acad4a62-5ebb-4531-b66d-a74e0490895e',
    email: process.env.docusign_email, // 'zeeshan.abbas@tkxel.com',                     // Email for your DocuSign Account
    password: process.env.docusign_password, //'commercial_direct',
    templateId: process.env.docusign_template_id, // '6329536d-aba1-48d8-8b49-2c7f0de9a9da',
    callbackUrl: process.env.docusign_callback_url, //'/docusign-success',
    wehhookUrl: process.env.docusign_webhookUrl,  //'/docusign-update',
    emailSubject: process.env.docusign_email_subject, //'Commercial Direct Agreement',
    roles: ['Borrower', 'CoBorrower', 'CoBorrower2', 'CoBorrower3'] // This has to be in sequence from borrower to coborrower 3
  },

  rollbarToken: process.env.rollbar_token

};
