/**
 * Created by zeeshan on 3/1/2017.
 */

module.exports = {


  // createOrUpdate: function (id, params) {
  //   return StaticContent.findOne({id: id}).then(function (staticContent) {
  //     if (staticContent) {
  //       return StaticContent.update(staticContent.id, params);
  //     } else {
  //       return StaticContent.create(params);
  //     }
  //   });
  // },

  getById: function (id) {
    return StaticContent.findOne({id: id});
  },

  createOrUpdate: function (type, params) {
    var content = {content: params, type: type};
    console.log(content)
    return StaticContent.findOne({type: type}).then(function (staticContent) {
      if (staticContent) {
        return StaticContent.update(staticContent.id, content);
      } else {
        return StaticContent.create(content);
      }
    });
  },

  getByType: function (type) {
    return StaticContent.find({type: type}).then(function (contents) {
      var contentObject = {};
      if (contents && contents.length > 0) {
        for (var i = 0; i < contents.length; i++) {
          contentObject[contents[i].type] = contents[i].content;
        }
      }
      return contentObject;
    });
  },

  getAll: function () {
    var types = [];
    var typeObject = sails.config.app_constants.staticContentType;
    for (var i = 0; i < Object.keys(typeObject).length; i++) {
      types.push(typeObject[Object.keys(typeObject)[i]]);
    }
    return this.getByType(types);
  },

  getByKey: function (key) {
    StaticContent.findOne({type: type}).then(function (staticContent) {
      return staticContent;
    });
  },

  // Need to refactor to single loop
  saveStaticContent: function (allParams) {
    var typeObject = sails.config.app_constants.staticContentType;
    var _this = this;
    return this.createOrUpdate(typeObject.about, allParams[typeObject.about]).then(function (response) {
      return _this.createOrUpdate(typeObject.privacy, allParams[typeObject.privacy]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.terms, allParams[typeObject.terms]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.contact_us, allParams[typeObject.contact_us]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.showcase, allParams[typeObject.showcase]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.loan_customizer, allParams[typeObject.loan_customizer]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.about_bayview, allParams[typeObject.about_bayview]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.sample_testimonial, allParams[typeObject.sample_testimonial])
    }).then(function (response) {
      return _this.getAll();
    });

  },


  saveProgramContent: function (allParams) {
    var typeObject = sails.config.app_constants.staticContentType;
    var _this = this;

    return _this.createOrUpdate(typeObject.programs_article_one, allParams[typeObject.programs_article_one]).then(function(response) {
      return _this.createOrUpdate(typeObject.programs_article_two, allParams[typeObject.programs_article_two]);
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.programs_article_three, allParams[typeObject.programs_article_three]);
    }).then(function (response) {
      return _this.getAll();
    })

  },

  saveLearnStaticContent: function (allParams) {
    var typeObject = sails.config.app_constants.staticContentType;
    var _this = this;
    return this.createOrUpdate(typeObject.property_types, allParams[typeObject.property_types]).then(function (response) {
      return _this.createOrUpdate(typeObject.programs, allParams[typeObject.programs])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.articles, allParams[typeObject.articles])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.knowledge_base, allParams[typeObject.knowledge_base])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.frequently_asked_questions, allParams[typeObject.frequently_asked_questions])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.new_section, allParams[typeObject.new_section])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.new_section_link, allParams[typeObject.new_section_link])
    }).then(function (response) {
      return _this.getAll();
    });
  },

  saveAboutStaticContent: function (allParams) {
    var typeObject = sails.config.app_constants.staticContentType;
    var _this = this;
    return this.createOrUpdate(typeObject.about, allParams[typeObject.about]).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionOne, allParams[typeObject.aboutSectionOne])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionTwo, allParams[typeObject.aboutSectionTwo])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionThree, allParams[typeObject.aboutSectionThree])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionFour, allParams[typeObject.aboutSectionFour])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionOneImg, allParams[typeObject.aboutSectionOneImg])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionTwoImg, allParams[typeObject.aboutSectionTwoImg])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionThreeImg, allParams[typeObject.aboutSectionThreeImg])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutSectionFourImg, allParams[typeObject.aboutSectionFourImg])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutWideOne, allParams[typeObject.aboutWideOne])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutWideTwo, allParams[typeObject.aboutWideTwo])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutWideThree, allParams[typeObject.aboutWideThree])
    }).then(function (response) {
      return _this.createOrUpdate(typeObject.aboutWideFour, allParams[typeObject.aboutWideFour])
    }).then(function (response) {
      return _this.getAll();
    });

  }

};
