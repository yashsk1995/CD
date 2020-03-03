/**
 * WhitelistedIPController
 *
 * @description :: Server-side logic for managing whitelisted ip
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  _render: function (req, res, next, subTitle, key) {
      StaticContentService.getByType(key).then(function (staticContent) {
        return res.view('adminaccess/static_content', {
          layout: 'adminaccess/layout',
          title: 'Static Content',
          subTitle: subTitle,
          key: key,
          value: staticContent[key] || '',
          message: '',
          type:"none"
        });
      }).catch(function (err) {
        return next(err);
      });
    },

  about: function (req, res, next) {
    var subTitle = "About Us";
    StaticContentService.getAll().then(function (staticContent) {
      return res.view('adminaccess/about', {
        layout: 'adminaccess/layout',
        title: 'Static Content',
        subTitle: subTitle,
        content: staticContent,
        key:"aboutUs",
        message: '',
        type:"none"
      });
    }).catch(function (err) {
      return next(err);
    });

  },

  listPrograms: function (req, res, next) {
    var subTitle = "Programs";
    var search =  '';
    var sort = '';
    var page = 1;
    var limit = 5000;
    StaticContentService.getAll().then(function (staticContent) {
      Promise.all([LandingPageService.list(search, sort, page, limit), LandingPageService.findById(staticContent.programsArticleOne),
        LandingPageService.findById(staticContent.programsArticleTwo),
        LandingPageService.findById(staticContent.programsArticleThree)]).then(function(response) {
          console.log("response", response[2] ? response[2].id : 'hello' );
        return res.view('adminaccess/programs', {
          layout: 'adminaccess/layout',
          title: 'Programs',
          landingPages: response[0].landingPages,
          articelOne: response[1] ? response[1].id : '',
          articelTwo: response[2] ? response[2].id : '',
          articelThree: response[3] ? response[3].id : '',
          subTitle: subTitle,
          content: staticContent,
          key:"programs",
          message: '',
          type:"none"
        });
      }).catch(function (err) {
        return next(err);
      });

    }).catch(function (err) {
      return next(err);
    });

  },

  privacy: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.privacy;
    var subTitle = "Privacy Policy";
    this._render(req, res, next, subTitle, key);
  },

  contact: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.contact_us;
    var subTitle = "Contact Us";
    this._render(req, res, next, subTitle, key);
  },

  videos: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.videos;
    var subTitle = "Videos";
    this._render(req, res, next, subTitle, key);
  },

  terms: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.terms;
    var subTitle = "Terms & Conditions";
    this._render(req, res, next, subTitle, key);
  },

  showcase: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.showcase;
    var subTitle = "Showcase";
    this._render(req, res, next, subTitle, key);
  },

  loanCustomizer: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.loan_customizer;
    var subTitle = "Loan Customizer";
    this._render(req, res, next, subTitle, key);
  },

  bayview: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.about_bayview;
    var subTitle = "About Bayview";
    this._render(req, res, next, subTitle, key);
  },

  testimonial: function (req, res, next) {
    var key = sails.config.app_constants.staticContentType.sample_testimonial;
    var subTitle = "Sample Testimonial";
    this._render(req, res, next, subTitle, key);
  },

  save: function (req, res) {
    var params = req.allParams();
    var subTitle = params.subTitle || '';
    var keys = Object.keys(params);
    var key = keys[0];
    var content = params[key];
    var _this = this;
    StaticContentService.createOrUpdate(key, content).then(function (staticContent) {
      var url = _this._returnUrl(key);
      return res.redirect(url);
    }).catch(function (error) {
      console.log('errorororororororor<<<<<<<<<>>>>>>>>>.')
      return res.view('adminaccess/static_content', {
        layout: 'adminaccess/layout',
        title: 'Static Content',
        subTitle: subTitle,
        key: key,
        value: content || '',
        message: 'Unable to Save Content'
      });
    });
  },

  saveAbout: function(req, res) {
    var subTitle = "About Us";
    var params = req.allParams();
    var OneImage = req.file('sectionOneImage');
    var TwoImage = req.file('sectionTwoImage');
    var ThreeImage = req.file('sectionThreeImage');
    var FourImage = req.file('sectionFourImage');
    Promise.all([
      FileUploadService.uploadToS3(OneImage, params['aboutUsSectionOneImage']),
      FileUploadService.uploadToS3(TwoImage, params['aboutUsSectionTwoImage']),
      FileUploadService.uploadToS3(ThreeImage, params['aboutUsSectionThreeImage']),
      FileUploadService.uploadToS3(FourImage, params['aboutUsSectionFourImage'])
    ]).then(function (response) {
      params['aboutUsSectionOneImage'] = (response[0] || params['aboutUsSectionOneImage']);
      params['aboutUsSectionTwoImage'] = (response[1] || params['aboutUsSectionTwoImage']);
      params['aboutUsSectionThreeImage'] = (response[2] || params['aboutUsSectionThreeImage']);
      params['aboutUsSectionFourImage'] = (response[3] || params['aboutUsSectionFourImage']);

      return StaticContentService.saveAboutStaticContent(params);
    }).then(function(resp) {
      return res.view('adminaccess/about', {
        layout: 'adminaccess/layout',
        title: 'Static Content',
        subTitle: subTitle,
        content: resp,
        key:"aboutUs",
        message: '',
        type:"none"
      });
    }).catch(function (err) {
      return res.view('adminaccess/about', {
        layout: 'adminaccess/layout',
        title: 'Static Content',
        subTitle: subTitle,
        content: params,
        message: err,
        key:"aboutUs",
        type:"none"
      });
    });

  },

  savePrograms: function (req, res) {
    var params = req.allParams();
    var subTitle = params.subTitle || '';
    var _this = this;
    StaticContentService.saveProgramContent(params).then(function (staticContent) {
      var url = '/adminaccess/programs';
      return res.redirect(url);
    }).catch(function (error) {
      console.log('errorororororororor<<<<<<<<<>>>>>>>>>.', error)
      return res.view('adminaccess/static_content', {
        layout: 'adminaccess/layout',
        title: 'Programs',
        subTitle: subTitle,
        key: key,
        value: content || '',
        message: 'Unable to Save Content'
      });
    });
  },

  _returnUrl: function(key) {
    var url;
    if(key == "aboutUs") {
      url = "/adminaccess/staticcontent/about";
    }
    else if(key == "privacyPolicy") {
      url = "/adminaccess/staticcontent/privacy";
    }
    else if(key == "termsAndConditions") {
      url = "/adminaccess/staticcontent/terms";
    }
    else if(key == "contactUs") {
      url = "/adminaccess/staticcontent/contact";
    }
    else if(key == "showcase") {
      url = "/adminaccess/staticcontent/showcase";
    }
    else if(key == "loanCustomizer") {
      url = "/adminaccess/staticcontent/loanCustomizer";
    }
    else if(key == "aboutBayview") {
      url = "/adminaccess/staticcontent/bayview";
    }
    else if(key == "sampleTestimonial") {
      url = "/adminaccess/staticcontent/testimonial";
    }
    else if(key == "programs") {
      url = "/adminaccess/programs";
    }
    else if(key == "videos") {
      url = "/adminaccess/staticcontent/videos";
    }

    return url;
  }


};

