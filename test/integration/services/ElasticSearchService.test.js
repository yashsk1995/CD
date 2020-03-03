/**
 * Created by zeeshan on 6/8/2017.
 //  */
//var ElasticSearchService = require('../../../api/services/ElasticSearchService'),
var assert = require('chai').assert;

describe('Elastic Search Service', function () {
  it('should index the object into elastic search', function (done) {
    this.timeout(10000);
    ElasticSearchService.index({
      id: 1,
      topic: {name: 'topic'},
      title: 'testing title for searching',
      term: 'term',
      slug: 'slug',
      category: 'Blog',
      pageTitle: 'page title',
      description: 'description',
      question: 'question',
      answer: 'answer',
      status: 'published'
    }, 'Blog').then(function (response) {
      assert.isDefined(response);
      done();
    }).catch(function (error) {
      assert.isUndefined(error);
      done();
    });
  });

  it('should search all and return the result', function (done) {
    this.timeout(80000);

    setTimeout(function () {
      ElasticSearchService.searchAll('testing title').then(function (searchResults) {
        assert.isAbove(searchResults.length, 0);
        assert.equal(searchResults[0].id, '1');
        assert.equal(searchResults[0].type, 'Blog');
        done();
      }).catch(function (error) {
        console.log(error);

        assert.isUndefined(error);
        done();
      });
    }, 3000);

  });


  it('should search Blog only and return the result', function (done) {
    this.timeout(10000);
    ElasticSearchService.searchByType('Blog', 'testing title').then(function (searchResults) {

      assert.isAbove(searchResults.length, 0);
      assert.equal(searchResults[0], '1');
      done();
    }).catch(function (error) {
      assert.isUndefined(error);
      done();
    });
  });


});
