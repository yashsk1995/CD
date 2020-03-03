/**
 * VideoPostController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var next = require('co-next');``
const path = require('path');
module.exports = {

    renderBanner: next(function* (req, res, next) {
        var banners = yield ConfigService.getByKey(sails.config.app_constants.configs.homeBanner);
        if(banners){
            banners = banners['banners'];
        }
        else{
            banners = [];
        }

        res.view('adminaccess/homepage/banner', {
            layout: 'adminaccess/layout',
            title: 'Homepage Banner',
            banners: banners
        });
    }),

    doBanner: next(function* (req, res, next) {
        
        req.file('file').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: '../../assets/images/admin/uploads'
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
        
            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0){
                return res.badRequest('No file was uploaded');
            }
        
            // Get the base URL for our deployed application from our custom config
            // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
            // var baseUrl = sails.config.custom.baseUrl;
        
            // Save the "fd" and the url where the avatar for a user can be accessed

            if(uploadedFiles.length > 0){
                // var homebanners = yield ConfigService.getByKey(sails.config.app_constants.configs.homeBanner);
                // if(homebanners == null || homebanners.length == 0){
                //     homebanners = [];
                // }

                // homebanners.push({
                //     filename: uploadedFiles[0].fd,
                //     active: true
                // })

                // yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeBanner, homebanners);
                var filename = uploadedFiles[0].fd;
                var filename_parse = path.parse(filename);
                filename = filename_parse.base;
                //filename = filename.substring(filename.lastIndexOf('\\') + 1);
                console.log(filename);
                // filename = filename.replace('../../assets/images/admin/uploads', '');
                res.send({
                    success: true,
                    filename: filename
                })
            }
            else{
                res.send({
                    success: false
                })
            }
        });
    }),

    saveBanner: next(function* (req, res, next) {
        yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeBanner, req.allParams());
        res.send('ok');
    }),

    renderPortal: next(function* (req, res, next) {
        var portals = yield ConfigService.getByKey(sails.config.app_constants.configs.homePortal);
        if(portals){
            portals = portals['portals'];
        }
        else{
            portals = [];
        }
        
        res.view('adminaccess/homepage/portal', {
            layout: 'adminaccess/layout',
            title: 'Homepage Portal',
            portals: portals
        });
    }),

    uploadPortal: next(function* (req, res, next) {
        // console.log(req.allParams('filename'));
        req.file('file').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: '../../assets/images/admin/uploads',
            // saveAs: req.allParams('filename')
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
        
            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0){
                return res.badRequest('No file was uploaded');
            }
        
            // Get the base URL for our deployed application from our custom config
            // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
            // var baseUrl = sails.config.custom.baseUrl;
        
            // Save the "fd" and the url where the avatar for a user can be accessed

            if(uploadedFiles.length > 0){
                // var homebanners = yield ConfigService.getByKey(sails.config.app_constants.configs.homeBanner);
                // if(homebanners == null || homebanners.length == 0){
                //     homebanners = [];
                // }

                // homebanners.push({
                //     filename: uploadedFiles[0].fd,
                //     active: true
                // })

                // yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeBanner, homebanners);
                var filename = uploadedFiles[0].fd;
                var filename_parse = path.parse(filename);
                filename = filename_parse.base;
                console.log(filename);
                // filename = filename.replace('../../assets/images/admin/uploads', '');
                res.send({
                    success: true,
                    filename: filename
                })
            }
            else{
                res.send({
                    success: false
                })
            }
        });
    }),

    savePortal: next(function* (req, res, next) {
        yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homePortal, req.allParams());
        res.send('ok');
    }),

    renderFeaturedDownload: next(function* (req, res, next) {
        var homeFeatured = yield ConfigService.getByKey(sails.config.app_constants.configs.homeFeatured);
        
        res.view('adminaccess/homepage/featured', {
            layout: 'adminaccess/layout',
            title: 'Homepage Featured Download',
            homeFeatured: homeFeatured
        });
    }),

    doFeaturedDownload: next(function* (req, res, next) {
        yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeFeatured, req.allParams());
        res.send('ok');
    }),

    renderMortgageInsight: next(function* (req, res, next) {
        var videos = yield ConfigService.getByKey(sails.config.app_constants.configs.homeMortgage);
        
        if(videos){
            videos = videos['videos'];
        }
        else{
            videos = [];
        }

        res.view('adminaccess/homepage/mortgage', {
            layout: 'adminaccess/layout',
            title: 'Home Commercial Mortgage Insight',
            videos: videos
        });
    }),

    doMortgageInsight: next(function* (req, res, next) {
        let instance = this;
        req.file('file').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 1000000000000,
            dirname: '../../assets/images/admin/uploads'
        }, function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
        
            // If no files were uploaded, respond with an error.
            if (uploadedFiles.length === 0){
                return res.badRequest('No file was uploaded');
            }
        
            // Get the base URL for our deployed application from our custom config
            // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
            // var baseUrl = sails.config.custom.baseUrl;
        
            // Save the "fd" and the url where the avatar for a user can be accessed

            if(uploadedFiles.length > 0){
                // var homebanners = yield ConfigService.getByKey(sails.config.app_constants.configs.homeBanner);
                // if(homebanners == null || homebanners.length == 0){
                //     homebanners = [];
                // }

                // homebanners.push({
                //     filename: uploadedFiles[0].fd,
                //     active: true
                // })

                // yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeBanner, homebanners);
                var filename = uploadedFiles[0].fd;
                var filename_parse = path.parse(filename);
                filename = filename_parse.base;
                console.log(filename);
                // filename = filename.replace('../../assets/images/admin/uploads', '');
                res.send({
                    success: true,
                    filename: filename
                })
            }
            else{
                res.send({
                    success: false
                })
            }
        });
    }),

    saveMortgageInsight: next(function* (req, res, next) {
        yield ConfigService.createOrUpdate(sails.config.app_constants.configs.homeMortgage, req.allParams());
        res.send('ok');
    }),
};

