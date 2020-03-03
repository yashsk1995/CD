/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': 'HomePageController.render',

  '/videos/commercial-direct-story': '/',

  '/author/eric-schultz': '/',

  '/gtm/test' : 'HomePageController.renderTest',

  '/learn': 'LearnController.render',

  '/programs': 'LearnController.renderPrograms',

  '/payFees/success': {view: 'payment_success'},

  '/about': 'StaticContentController.renderAbout',

  '/privacy': 'StaticContentController.renderPrivacy',

  '/terms-conditions': 'StaticContentController.renderTerms',

  '/contact-us': 'StaticContentController.renderContactUs',

  'get /adminaccess': 'adminaccess/LoginController.render',

  'post /adminaccess': 'adminaccess/LoginController.login',

  'get /adminaccess/forgot-password': 'adminaccess/LoginController.renderForgotPassword',

  'post /adminaccess/forgot-password': 'adminaccess/LoginController.forgotPassword',

  'get /adminaccess/reset-password/:token': 'adminaccess/LoginController.renderResetPassword',

  'post /adminaccess/reset-password': 'adminaccess/LoginController.resetPassword',

  '/adminaccess/logout': 'adminaccess/LoginController.logout',

  '/adminaccess/users': 'adminaccess/UserController.list',

  'get /adminaccess/user/delete': 'adminaccess/UserController.delete',

  'get /adminaccess/user/active': 'adminaccess/UserController.active',

  'get /adminaccess/user/create': 'adminaccess/UserController.renderCreate',

  'post /adminaccess/user/create': 'adminaccess/UserController.create',

  'get /adminaccess/user/edit/:id': 'adminaccess/UserController.renderEdit',

  'post /adminaccess/user/edit/:id': 'adminaccess/UserController.edit',

  '/adminaccess/whitelistedips': 'adminaccess/WhitelistedIPController.list',

  'get /adminaccess/whitelistedip/create': 'adminaccess/WhitelistedIPController.renderCreate',

  'post /adminaccess/whitelistedip/create': 'adminaccess/WhitelistedIPController.create',

  'get /adminaccess/whitelistedip/delete': 'adminaccess/WhitelistedIPController.delete',

  '/adminaccess/knowledgebasetopics': 'adminaccess/KnowledgeBaseTopicController.list',

  'get /adminaccess/knowledgebasetopic/create': 'adminaccess/KnowledgeBaseTopicController.renderCreate',

  'post /adminaccess/knowledgebasetopic/create': 'adminaccess/KnowledgeBaseTopicController.create',

  'get /adminaccess/knowledgebasetopic/delete': 'adminaccess/KnowledgeBaseTopicController.delete',

  'get /adminaccess/knowledgebasetopic/edit/:id': 'adminaccess/KnowledgeBaseTopicController.renderEdit',

  'post /adminaccess/knowledgebasetopic/edit/:id': 'adminaccess/KnowledgeBaseTopicController.edit',

  '/adminaccess/knowledgebasearticles': 'adminaccess/KnowledgeBaseArticleController.list',

  'get /adminaccess/knowledgebasearticle/create': 'adminaccess/KnowledgeBaseArticleController.renderCreate',

  'post /adminaccess/knowledgebasearticle/create': 'adminaccess/KnowledgeBaseArticleController.create',

  'get /adminaccess/knowledgebasearticle/delete': 'adminaccess/KnowledgeBaseArticleController.delete',

  'get /adminaccess/knowledgebasearticle/edit/:id': 'adminaccess/KnowledgeBaseArticleController.renderEdit',

  'post /adminaccess/knowledgebasearticle/edit/:id': 'adminaccess/KnowledgeBaseArticleController.edit',

  'get /adminaccess/knowledgebasearticle/publish': 'adminaccess/KnowledgeBaseArticleController.publish',

  'get /adminaccess/knowledgebasearticle/unpublish': 'adminaccess/KnowledgeBaseArticleController.unPublish',

  '/adminaccess/landingpages': 'adminaccess/LandingPageController.list',

  'get /adminaccess/programs': 'adminaccess/StaticContentController.listPrograms',
  'post /adminaccess/programs': 'adminaccess/StaticContentController.savePrograms',

  'get /adminaccess/landingpage/create': 'adminaccess/LandingPageController.renderCreate',

  'post /adminaccess/landingpage/create': 'adminaccess/LandingPageController.create',

  'get /adminaccess/landingpage/delete': 'adminaccess/LandingPageController.delete',

  'get /adminaccess/landingpage/edit/:id': 'adminaccess/LandingPageController.renderEdit',

  'post /adminaccess/landingpage/edit/:id': 'adminaccess/LandingPageController.edit',

  'get /adminaccess/landingpage/publish': 'adminaccess/LandingPageController.publish',

  'get /adminaccess/landingpage/unpublish': 'adminaccess/LandingPageController.unPublish',

  '/adminaccess/successstories': 'adminaccess/SuccessStoryController.list',

  'get /adminaccess/successstory/create': 'adminaccess/SuccessStoryController.renderCreate',

  'post /adminaccess/successstory/create': 'adminaccess/SuccessStoryController.create',

  'get /adminaccess/successstory/delete': 'adminaccess/SuccessStoryController.delete',

  'get /adminaccess/successstory/edit/:id': 'adminaccess/SuccessStoryController.renderEdit',

  'post /adminaccess/successstory/edit/:id': 'adminaccess/SuccessStoryController.edit',

  'get /adminaccess/successstory/publish': 'adminaccess/SuccessStoryController.publish',

  'get /adminaccess/successstory/unpublish': 'adminaccess/SuccessStoryController.unPublish',

  '/adminaccess/faqs': 'adminaccess/FrequentlyAskedQuestionController.list',

  'get /adminaccess/faq/create': 'adminaccess/FrequentlyAskedQuestionController.renderCreate',

  'post /adminaccess/faq/create': 'adminaccess/FrequentlyAskedQuestionController.create',

  'get /adminaccess/faq/publish': 'adminaccess/FrequentlyAskedQuestionController.publish',

  'get /adminaccess/faq/unpublish': 'adminaccess/FrequentlyAskedQuestionController.unPublish',

  'get /adminaccess/faq/delete': 'adminaccess/FrequentlyAskedQuestionController.delete',

  'get /adminaccess/faq/edit/:id': 'adminaccess/FrequentlyAskedQuestionController.renderEdit',

  'post /adminaccess/faq/edit/:id': 'adminaccess/FrequentlyAskedQuestionController.edit',

  '/adminaccess/blogcategories': 'adminaccess/BlogCategoryController.list',
  'get /adminaccess/blogcategory/create': 'adminaccess/BlogCategoryController.renderCreate',
  'post /adminaccess/blogcategory/create': 'adminaccess/BlogCategoryController.create',
  'get /adminaccess/blogcategory/delete': 'adminaccess/BlogCategoryController.delete',
  'get /adminaccess/blogcategory/edit/:id': 'adminaccess/BlogCategoryController.renderEdit',
  'post /adminaccess/blogcategory/edit/:id': 'adminaccess/BlogCategoryController.edit',

  '/adminaccess/blogposts': 'adminaccess/BlogPostController.list',
  'get /adminaccess/blogpost/create': 'adminaccess/BlogPostController.renderCreate',
  'post /adminaccess/blogpost/create': 'adminaccess/BlogPostController.create',
  'get /adminaccess/blogpost/delete': 'adminaccess/BlogPostController.delete',
  'get /adminaccess/blogpost/edit/:id': 'adminaccess/BlogPostController.renderEdit',
  'post /adminaccess/blogpost/edit/:id': 'adminaccess/BlogPostController.edit',
  'get /adminaccess/blogpost/publish': 'adminaccess/BlogPostController.publish',
  'get /adminaccess/blogpost/unpublish': 'adminaccess/BlogPostController.unPublish',

  '/adminaccess/videocategories': 'adminaccess/VideoCategoryController.list',
  'get /adminaccess/videocategory/create': 'adminaccess/VideoCategoryController.renderCreate',
  'post /adminaccess/videocategory/create': 'adminaccess/VideoCategoryController.create',
  'get /adminaccess/videocategory/delete': 'adminaccess/VideoCategoryController.delete',
  'get /adminaccess/videocategory/edit/:id': 'adminaccess/VideoCategoryController.renderEdit',
  'post /adminaccess/videocategory/edit/:id': 'adminaccess/VideoCategoryController.edit',

  '/adminaccess/videoposts': 'adminaccess/VideoPostController.list',
  'get /adminaccess/videopost/create': 'adminaccess/VideoPostController.renderCreate',
  'post /adminaccess/videopost/create': 'adminaccess/VideoPostController.create',
  'get /adminaccess/videopost/delete': 'adminaccess/VideoPostController.delete',
  'get /adminaccess/videopost/edit/:id': 'adminaccess/VideoPostController.renderEdit',
  'post /adminaccess/videopost/edit/:id': 'adminaccess/VideoPostController.edit',
  'get /adminaccess/videopost/publish': 'adminaccess/VideoPostController.publish',
  'get /adminaccess/videopost/unpublish': 'adminaccess/VideoPostController.unPublish',

  // 'get /adminaccess/staticcontent': 'adminaccess/StaticContentController.render',

  'get /adminaccess/staticcontent/about': 'adminaccess/StaticContentController.about',
  'post /adminaccess/staticcontent/about': 'adminaccess/StaticContentController.saveAbout',
  'get /adminaccess/staticcontent/privacy': 'adminaccess/StaticContentController.privacy',

  'get /adminaccess/staticcontent/contact': 'adminaccess/StaticContentController.contact',
  'get /adminaccess/staticcontent/terms': 'adminaccess/StaticContentController.terms',

  'get /adminaccess/staticcontent/showcase': 'adminaccess/StaticContentController.showcase',
  'get /adminaccess/staticcontent/loanCustomizer': 'adminaccess/StaticContentController.loanCustomizer',

  'get /adminaccess/staticcontent/bayview': 'adminaccess/StaticContentController.bayview',
  'get /adminaccess/staticcontent/testimonial': 'adminaccess/StaticContentController.testimonial',
  'get /adminaccess/staticcontent/videos': 'adminaccess/StaticContentController.videos',


  'post /adminaccess/staticcontent': 'adminaccess/StaticContentController.save',

  'get /adminaccess/staticcontent-learn': 'adminaccess/StaticLearnController.render',

  'post /adminaccess/staticcontent-learn': 'adminaccess/StaticLearnController.save',

  'get /adminaccess/pricematrix': 'adminaccess/PriceMatrixController.render',

  'post /adminaccess/pricematrix': 'adminaccess/PriceMatrixController.save',

  'get /adminaccess/rateadjustments': 'adminaccess/RateAdjustmentsController.render',
  'post /adminaccess/rateadjustments': 'adminaccess/RateAdjustmentsController.save',

  'get /adminaccess/ltvadjustments': 'adminaccess/LTVAdjustmentsController.render',
  'post /adminaccess/ltvadjustments': 'adminaccess/LTVAdjustmentsController.save',

  'get /adminaccess/lists': 'adminaccess/ListsController.render',
  'post /adminaccess/lists': 'adminaccess/ListsController.save',

  'get /adminaccess/sales_reps': 'adminaccess/SalesRepsController.render',
  'post /adminaccess/sales_reps': 'adminaccess/SalesRepsController.save',

  'get /adminaccess/dashboard': 'loanofficer/DashboardController.render',

  'post /login': 'LoginController.login',

  'post /forgot-password': 'LoginController.forgotPassword',

  'get /reset-password/:token': 'LoginController.renderResetPassword',

  'post /reset-password': 'LoginController.resetPassword',

  'post /miniapp/save': 'LoanCalculatorController.saveMiniApp',

  'post /miniapp-simple/save': 'LoanCalculatorController.saveMiniAppSimple',

  'get /quick-calculator' : 'HomePageController.renderQuickCalculator',

  '/advance-calculator': 'LoanCalculatorController.renderCalculator',

  'post /advance-calculator/calculate': 'LoanCalculatorController.calculateAdvance',

  'post /quick-calculator/calculate': 'LoanCalculatorController.calculateQuick',

  'post /loan-application/save': 'LoanCalculatorController.saveLoanApplication',

  'post /loan-application/save/:id': 'LoanCalculatorController.saveExistingLoanApp',

  '/continue': 'QuickApplicationController.continue',

  'get /quick-application': 'QuickApplicationController.render',

  'get /application-investorflip': 'QuickApplicationController.renderForInvestorFixFlop',

  'post /quick-application/:id': 'QuickApplicationController.save',

  '/confidence-rate': 'ConfidenceRateController.render',

  '/download/loan-terms': 'ConfidenceRateController.downloadTermSheet',

  'get /search': 'SearchController.search',

  '/knowledge': 'KnowledgeController.list',

  'get /knowledge/:topic/:term': 'KnowledgeController.detail',

  'get /knowledge/:id': 'KnowledgeController.reRoute',

  'get /knowledgeBase/:topic': 'KnowledgeController.renderbyTopic',

  'post /knowledge/feedback': 'KnowledgeController.saveFeedback',

  '/faq': 'FrequentlyAskedQuestionController.list',

  'post /faq/feedback': 'FrequentlyAskedQuestionController.saveFeedback',

  '/showcase': 'SuccessStoryController.list',

  '/showcase/:id': 'SuccessStoryController.detail',

  '/blog': 'BlogPostController.list',

  '/blog/:slug': 'BlogPostController.detail',

  '/blog/category/:category': 'BlogPostController.listCategory',

  '/hidden12345': 'VideoPostController.list',

  '/videos/:slug': 'VideoPostController.detail',

  '/videos/category/:slug': 'VideoPostController.listCategory',

  '/l/:slug': 'LandingPageController.render',


  'post /contactUsLanding': 'LandingPageController.contact',

  'get /print/application/:id': 'PrintController.renderFullApplication',

  'get /print/loan-terms/:id': 'PrintController.renderLoanTerms',

  'get /application': 'FullApplicationController.routeApplication',

  'get /application/start': 'FullApplicationController.startApplication',

  'get /application/personal-info': 'FullApplicationController.renderPersonalInfo',

  'post /application/personal-info': 'FullApplicationController.savePersonalInfo',

  'get /application/loan-request': 'FullApplicationController.renderLoanRequest',

  'post /application/loan-request': 'FullApplicationController.saveLoanRequest',

  'get /application/property-info': 'FullApplicationController.renderPropertyInfo',

  'post /application/property-info': 'FullApplicationController.savePropertyInfo',

  'get /application/business-info': 'FullApplicationController.renderBusinessInfo',

  'post /application/business-info': 'FullApplicationController.saveBusinessInfo',

  'get /application/employment-info': 'FullApplicationController.renderEmploymentInfo',

  'post /application/employment-info': 'FullApplicationController.saveEmploymentInfo',

  'get /application/income-expense-info': 'FullApplicationController.renderIncomeExpenseInfo',

  'post /application/income-expense-info': 'FullApplicationController.saveIncomeExpenseInfo',

  'get /application/assets-liabilities': 'FullApplicationController.renderAssetsLiabilities',

  'post /application/assets-liabilities': 'FullApplicationController.saveAssetsLiabilities',

  'get /application/personal-declarations': 'FullApplicationController.renderPersonalDeclarations',

  'post /application/personal-declarations': 'FullApplicationController.savePersonalDeclarations',

  'get /application/business-declarations': 'FullApplicationController.renderBusinessDeclarations',

  'post /application/business-declarations': 'FullApplicationController.saveBusinessDeclarations',

  'get /application/general-authorization': 'FullApplicationController.renderGeneralAuthorization',

  'post /application/general-authorization': 'FullApplicationController.saveGeneralAuthorization',

  'get /application/info-for-monitoring': 'FullApplicationController.renderInfoForMonitoring',

  'post /application/info-for-monitoring': 'FullApplicationController.saveInfoForMonitoring',

  'get /application/review': 'FullApplicationController.renderReviewApplication',

  'get /docusign/signingUrl' : 'DocusignController.getDocusignUrl',

  '/docusign-success' : 'DocusignController.saveDocusignStatus',

  'post /docusign-update' : 'DocusignController.handleWebhook',

  '/application/submit': 'FullApplicationController.submitApplication',

  '/application/completed': 'FullApplicationController.renderCompleted',

  'get /payFees': 'PaymentController.render',

  'post /payFees/confirm-paypal': 'PaymentController.confirmPayPalPayment',

  'get /robots.txt': 'HomePageController.getRobots',
  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

   '/login': 'LoginController.render',
   '/register': 'LoginController.renderRegister',
   'get /silver-qualifier': 'LoanCalculatorController.silverQualifier',
   'post /silver-qualifier': 'LoanCalculatorController.silverQualifierCalculate',
   'post /generatetermsheet': 'LoanCalculatorController.generateTermSheet',
   'get /testgeneratetermsheet': 'LoanCalculatorController.testgenerateTermSheet',
   'get /downloadtermsheet': 'LoanCalculatorController.downloadTermSheet',

   'post /api_register': 'LoginController.apiRegister',
   'post /api_check': 'LoginController.apiCheck',
   'post /api_login': 'LoginController.apiLogin',
   'post /api_logout': 'LoginController.apiLogout',

   'get /password-reset': 'LoginController.renderPasswordReset',
   'post /password-reset': 'LoginController.doPasswordReset',

    'get /password-set': 'LoginController.renderPasswordSet',
    'post /password-set': 'LoginController.doPasswordSet',

    'get /adminaccess/homebanner': 'adminaccess/HomepageController.renderBanner',
    'post /adminaccess/homebanner': 'adminaccess/HomepageController.doBanner',
    'post /adminaccess/savehomebanner': 'adminaccess/HomepageController.saveBanner',

    'get /adminaccess/homeportal': 'adminaccess/HomepageController.renderPortal',
    'post /adminaccess/uploadPortal': 'adminaccess/HomepageController.uploadPortal',
    'post /adminaccess/savehomeportal': 'adminaccess/HomepageController.savePortal',

    'get /adminaccess/featureddownload': 'adminaccess/HomepageController.renderFeaturedDownload',
    'post /adminaccess/featureddownload': 'adminaccess/HomepageController.doFeaturedDownload',

    'get /adminaccess/homemortgageinsight': 'adminaccess/HomepageController.renderMortgageInsight',
    'post /adminaccess/homemortgageinsight': 'adminaccess/HomepageController.doMortgageInsight',
    'post /adminaccess/savehomemortgageinsight': 'adminaccess/HomepageController.saveMortgageInsight',
};
