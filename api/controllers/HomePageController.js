/**
 * CustomLoanController
 *
 * @description :: Server-side logic for managing blog posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var mysql = require('mysql');

var con = mysql.createConnection({
  // commercial_dev/prod
  host: process.env.dbHost,
  user: process.env.user, //optional
  password: process.env.password, //optional
  database: process.env.database //optional

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!3");``
});

var next = require('co-next');

module.exports = {

  render: next(function* (req, res) {

            
var portals;
            con.query('SELECT * FROM config WHERE id=8', function (error, results, fields) {
              if (error)
                  throw error;

              results.forEach(result => {
                  // console.log(result.value);
                  var j= result.value;
                  var json = JSON.parse(j);
                  console.log(json["portals"]);
                  portals = json["portals"];

              });
            });

            var homeFeatured;
            con.query('SELECT * FROM config WHERE id=9', function (error, results, fields) {
              if (error)
                  throw error;

              results.forEach(result2 => {
                  
                  homeFeatured = JSON.parse(result2.value);

              });
            });



    var loanLookup = yield ConfigService.getByKey(sails.config.app_constants.configs.loanLookup);

    var banners = yield ConfigService.getByKey(sails.config.app_constants.configs.homeBanner);
    if(banners){
        banners = banners['banners'];
    }
    else{
        banners = [];
    }
    // var portals = yield ConfigService.getByKey(sails.config.app_constants.configs.homePortal);
    // if(portals){
    //     portals = portals['portals'];
    // }
    // else{
    //     portals = [];
    // }
    // console.log(portals);

    // var homeFeatured = yield ConfigService.getByKey(sails.config.app_constants.configs.homeFeatured);

    var videos = yield ConfigService.getByKey(sails.config.app_constants.configs.homeMortgage);
        
    if(videos){
        videos = videos['videos'];
    }
    else{
        videos = [];
    }

    res.locals.layout = 'new/homelayout';
    res.view('new/pages/homepage', {
      states: sails.config.app_constants.lendingStates,
      loanTypes: sails.config.app_constants.loanTypes,
      propertyTypes: sails.config.app_constants.propertyTypes,
      chooseWithin: sails.config.app_constants.chooseWithin,
      creditScores: sails.config.app_constants.creditScore,
      loanLookup: loanLookup,
      urlParams: req.query,
      isAuthenticated: req.session.authenticated ? true : false,

      banners: banners,
      portals: portals,
      homeFeatured: homeFeatured,
      videos: videos
    });
  }),

  renderTest: function (req, res) {
    res.view('test', {layout:''})
  },

  renderQuickCalculator: next(function* (req, res) {
    var loanLookup = yield ConfigService.getByKey(sails.config.app_constants.configs.loanLookup);

    res.view('quick-calculator', {
      states: sails.config.app_constants.lendingStates,
      loanTypes: sails.config.app_constants.loanTypes,
      propertyTypes: sails.config.app_constants.propertyTypes,
      chooseWithin: sails.config.app_constants.chooseWithin,
      creditScores: sails.config.app_constants.creditScore,
      urlParams: req.query,
      loanLookup: loanLookup,
      layout: ''
    });
  }),

  getRobots: function(req, res) {
    var fs = require('fs');
    var path = require('path');

    res.set('Content-Type', 'text/plain');
    var robotsPath = '';
    if (sails.config.environment === "production"){
      robotsPath = path.join(sails.config.appPath, '/robots.prod.txt');
    }
    else{
      robotsPath = path.join(sails.config.appPath, '/.tmp/public/robots.dev.txt');
    }
    fs.exists(robotsPath, function(exists){
      if (exists){
        // serve file found
        var readStream = fs.createReadStream(robotsPath);
        readStream.on('data', function(data){
          res.write(data);
        });

        readStream.on('end', function(){
          res.end();
        });
      }
      else{
        // allow all robots if file cannot be found
        res.write('User-Agent: *');
        res.write('\n');
        res.write('Disallow: ');
        res.write('\n');
        res.end();
      }
    });
  }


};

