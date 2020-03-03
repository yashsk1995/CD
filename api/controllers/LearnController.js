module.exports = {


      render: function (req, res, next) {
        var property_types = sails.config.app_constants.staticContentType.property_types;
        var Programs = sails.config.app_constants.staticContentType.programs;
        var new_section = sails.config.app_constants.staticContentType.new_section;
        var new_section_link = sails.config.app_constants.staticContentType.new_section_link;
        var Articles = sails.config.app_constants.staticContentType.articles;
        var knowledge_base = sails.config.app_constants.staticContentType.knowledge_base;
        var faq = sails.config.app_constants.staticContentType.frequently_asked_questions;
        Promise.all([StaticContentService.getByType([property_types, Articles, Programs, new_section, new_section_link, knowledge_base, faq]) ]).then(function (response) {
              return res.view('learn', {
                property_types: response[0].propertyTypes,
                programs: response[0].programs,
                new_section: response[0].newSection,
                new_section_link: response[0].newSectionLink,
                articles: response[0].articles,
                knowledge_base: response[0].knowledgeBase,
                frequently_asked_questions: response[0].frequentlyAskedQuestions,
                locals: {
                  pageTitle: "Commercial Direct - Learn"
                }
              });

          }).catch(function (error) {
            res.redirect('/404');
          });
      },

      renderPrograms: function (req, res, next) {
        var property_types = sails.config.app_constants.staticContentType.property_types;
        var Programs = sails.config.app_constants.staticContentType.programs;       
        var new_section = sails.config.app_constants.staticContentType.new_section;
        var new_section_link = sails.config.app_constants.staticContentType.new_section_link;
        StaticContentService.getAll().then(function (staticContent) { 
          Promise.all([LandingPageService.findById(staticContent.programsArticleOne),
            LandingPageService.findById(staticContent.programsArticleTwo),
            LandingPageService.findById(staticContent.programsArticleThree), BlogPostService.list('', 'createdAt DESC', 1, 6, true) ]).then(function (response) {
              console.log()
              return res.view('programs_and_processes', {
                property_types: staticContent.propertyTypes,
                programs: staticContent.programs,
                new_section: staticContent.newSection,
                new_section_link: staticContent.newSectionLink,
                articleOne: response[0],
                articleTwo: response[1],
                articleThree: response[2],
                blogPosts: response[3].posts,
                locals: {
                  pageTitle: "Commercial Direct - Programs & Process"
                }
              });

          }).catch(function (error) {
            res.redirect('/404');
          });
        }).catch(function (error) {
          res.redirect('/404');
        });
       
      },



    }
