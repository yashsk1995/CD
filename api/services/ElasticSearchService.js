/**
 * Created by zeeshan on 3/10/2017.
 */
var elasticsearch = require('elasticsearch');

var Rollbar = require("rollbar");
var rollbar = new Rollbar(sails.config.rollbarToken);

var client = new elasticsearch.Client({
  host: sails.config.elastic_search.host,
  log: sails.config.elastic_search.log
});

module.exports = {

  index: function (object, type) {
    var topicName = '';
    if (object.topic && object.topic.name && object.topic.name != '') {
      topicName = object.topic.name;
    }

    var keywords = [];
    if (topicName != '') keywords.push(topicName);
    if (object.title) keywords.push(object.title)
    if (object.term) keywords.push(object.term);
    if (object.slug) keywords.push(object.slug);
    if (object.category) keywords.push(object.category);
    if (object.pageTitle) keywords.push(object.pageTitle);
    if (object.description) keywords.push(object.description);
    if (object.question) keywords.push(object.question);
    if (object.answer) keywords.push(object.answer);
    if (object.keywords) keywords = keywords.concat(object.keywords.split(","));
    if (object.metaTags) keywords = keywords.concat(object.metaTags.split(","));
    if (object.purposeTags) keywords = keywords.concat(object.purposeTags.split(","));
    if (object.propertyTypeTags) keywords = keywords.concat(object.propertyTypeTags.split(","));
    if (object.locationTags) keywords = keywords.concat(object.locationTags.split(","));

    var indexObj = {
      index: sails.config.elastic_search.index,
      type: type,
      id: object.id,
      body: {
        lookupId: object.id,
        type: type,
        title: object.title || object.term || topicName || object.question || '',
        keywords: keywords,
        status: object.status || ''
      }
    };

    return client.index(indexObj).then(function (response) {
      return response;
    }).catch(function (error) {
      rollbar.log("[ES][Index]: " + JSON.stringify(error) + " | " + JSON.stringify(indexObj));
      throw {message: 'Unable to connect Elastic Search. Please contact admin'};
    });
  },

  _search: function (type, keyword) {
    type = type || '';
    var searchObject = {
      index: sails.config.elastic_search.index,
      type: type,
      body: {
        query: {
          bool: {
            must: {
              match: {
                keywords: keyword
              }
            },
            filter: {
              match: {
                status: 'published'
              }
            }
          }
        }
      }
    };
    return client.search(searchObject).then(function (response) {
      return response.hits.hits;
    }).catch(function (error) {
      rollbar.log("[ES][Search]: " + JSON.stringify(error) + " | " + JSON.stringify(searchObject));
      throw error;
    });
  },

  searchAll: function (keyword) {
    return this._search('', keyword).then(function (results) {
      var searchResults = [];
      results.forEach(function (result) {
        var url = result._type + '/' + result._id;
        if (result._type == sails.config.app_constants.es_types.faq) {
          url = result._type + '#' + result._id;
        }
        searchResults.push({
          id: result._id,
          type: result._type,
          title: result._source.title,
          url: url
        });
      });
      return searchResults;
    });
  },

  searchByType: function (type, keyword) {
    if (!keyword) {
      return new Promise(function (resolve, reject) {
        resolve('');
      });
    }
    return this._search(type, keyword).then(function (results) {
      var searchResults = [];
      results.forEach(function (result) {
        searchResults.push(result._id);
      });
      return searchResults;
    });
  }
};
