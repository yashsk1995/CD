/**
 * WhitelistedIPController
 *
 * @description :: Server-side logic for managing whitelisted ip
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

      render: function (req, res, next) {

        StaticContentService.getAll().then(function (staticContent) {
          return res.view('adminaccess/static_content_learn', {
            layout: 'adminaccess/layout',
            title: 'Static Content - Learn',
            content: staticContent || {},
            message: ''
          });
        }).catch(function (err) {
          return next(err);
        });
      },

      save: function (req, res) {
        var params = req.allParams();
        StaticContentService.saveLearnStaticContent(params).then(function (staticContent) {
          return res.view('adminaccess/static_content_learn', {
            layout: 'adminaccess/layout',
            title: 'Static Content - Learn',
            content: staticContent || {},
            message: 'Saved Successfully'
          });
        }).catch(function (error) {
          return res.view('adminaccess/static_content_learn', {
            layout: 'adminaccess/layout',
            title: 'Static Content',
            content: params,
            message: 'Unable to Save Content'
          });
        });
      }

    };

