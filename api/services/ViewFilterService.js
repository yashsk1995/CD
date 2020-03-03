module.exports = {
  /**
   * Apply moment.js at server-side as a  filter
   *
   * @param d - Dirty Date
   * @return 'x formated date'
   */
  formatDate: function (d) {
    var moment = require('moment');
    if (d)
      return moment(d).format('MM/DD/YYYY');
    return '';
  },


  formatFullDate: function (d) {
    var moment = require('moment');
    if (d)
      return moment(d).format('MMMM Do, YYYY');
    return '';
  },

  formatCurrency: function (x) {
    if(x){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return '';
  },

  getHtmlShortContents: function (html) {
    if (html.indexOf('<p>') > -1) {
      var trimmedContent = html.substring(0, html.indexOf('</p>') + 4);
      if (trimmedContent.length > 504) {
        return trimmedContent.substring(0, 500) + "</p>";
      }
      return trimmedContent;
    }
    return html.substring(0, 400);
  },

  appendAppUrl: function (path) {
    var appUrl = sails.config.app_url;
    if(path && path != '/'){
      appUrl = appUrl + path;
    }
    return appUrl;
  },

  urlEncode: function(uri) {
    uri = uri.toLowerCase();
    var c = encodeURIComponent(uri);
    c = c.replace(/-/g, "_");
    c = c.replace(/%20/g, "-");
    return c;
  },

  urlDecode: function(uri) {
    uri = uri.replace(/-/g, "%20");
    uri = uri.replace(/_/g, "-");
    var c = decodeURIComponent(uri);
    return c;
  },

  getHomeUrl: function (url) {
    // var homeUrl = sails.config.homepage_url || '';
    // if(homeUrl) {
    //   return homeUrl + url;
    // }
    return url;
  }

};
