/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  hookTimeout: 30000, // 30 seconds

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'commercialDirectDBProduction'
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
    to: 'info@shf-commercialdirect.com',
    new_lead: process.env.new_lead_email
  },

 

  sales_force: {
    url: process.env.sf_url,
    username: process.env.sf_username,
    password: process.env.sf_password,
    record_type_id: process.env.sf_recordtype,
    company: process.env.sf_company,
    status: process.env.sf_status
  },

  paypal: {
    mode: process.env.pp_mode,
    clientId: process.env.pp_client_id,
    secretKey: process.env.pp_secret_key
  },

  docusign: {
    apiUrl: process.env.docusign_api_url, //'https://demo.docusign.net/restapi/v2/login_information',
    integratorKey: process.env.docusign_integrator_key, //'acad4a62-5ebb-4531-b66d-a74e0490895e',
    email: process.env.docusign_email, // 'info@pllay.co',                     // Email for your DocuSign Account
    password: process.env.docusign_password, //'commercial_direct',
    templateId: process.env.docusign_template_id, // '6329536d-aba1-48d8-8b49-2c7f0de9a9da',
    callbackUrl: process.env.docusign_callback_url, //'/docusign-success',
    wehhookUrl: process.env.docusign_webhookUrl,  //'/docusign-update',
    emailSubject: process.env.docusign_email_subject, //'Commercial Direct Agreement',
    roles: ['Guarantor 1', 'Guarantor 2', 'Guarantor 3', 'Guarantor 4'] // This has to be in sequence from borrower to coborrower 3
  },

  rollbarToken: process.env.rollbar_token

};
