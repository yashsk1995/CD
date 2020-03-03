/**
 * KnowledgeBaseTopicController
 *
 * @description :: Server-side logic for displaying knowledge base topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res, next) {
    var search = req.param('search') || '';

    ElasticSearchService.searchByType(sails.config.app_constants.es_types.knowledge, search).then(function (ids) {
      // Checking if elastic search is send empty result or search is empty
      if (Array.isArray(ids) && ids.length < 1) {
        return {
          pageCount: 0,
          topics: []
        }
      }
      return KnowledgeBaseTopicService.list('', '', false, false, true, ids);
    }).then(function (response) {
      var topics = [];
      response.topics.forEach(function (topic) {
        if (topic.articles.length > 0) {
          topics.push(topic);
        }
      });
      return topics;
    }).then(function (topics) {
      return Promise.all([topics, KnowledgeBaseArticleService.list('', 'publishedAt DESC', 1, 6, true)]);
    }).then(function (data) {
      return res.view('knowledge_topics', {
        topics: data[0],
        latestArticles: data[1].articles,
        search: search,
        locals: {
          pageTitle: "Commercial Direct - Knowledge Base", 
        }
      });
    }).catch(function (err) {
      return next(err);
    });
  },

  renderbyTopic: function (req, res, next) {
    var topic = req.param('topic') || '';
    var search = req.param('search') || '';
    var topicName;
    KnowledgeBaseTopicService.findBySlug(topic).then(function (response) {  
      if (response) {
        topicName = response.name;
        var topic = [];
        topic[0] = {};
        topic[0].name = topicName;
        KnowledgeBaseArticleService.listbyTopic(response.id).then(function (articles) {         
          topic[0].articles = articles         
          return Promise.all([topic, KnowledgeBaseArticleService.list('', 'publishedAt DESC', 1, 6, true)]).then(function(data) {
            return res.view('knowledge_topics', {
              topics: data[0],
              latestArticles: data[1].articles,
              search: search,           
              locals: {
                pageTitle: topicName,
                topic:topicName,
              }        
          });
        });
        }).catch(function (error) {
          console.log(error)
          res.redirect('/404');
        });
   
      } else {
        console.log(error)
        res.redirect('/404');
      }
    }).catch(function (error) {
      console.log(error)
      res.redirect('/404');
    });
  },

  detail: function (req, res, next) {
    var topic = req.param('topic') || '';
    var term = req.param('term') || '';
    //var type = sails.config.app_constants.staticContentType.sample_testimonial;
    Promise.all([KnowledgeBaseTopicService.findBySlug(topic), KnowledgeBaseArticleService.findBySlug(term)]).then(function (response) {
      if (response[0]) {
        return Promise.all([response[1], KnowledgeBaseArticleService.listRelated(response[1].id, response[1].topic)]).then(function(data) {
          return res.view('knowledge_article', {
            article: data[0],
            relatedArticles: data[1],
            topic:response[0].name,
            locals: {
              pageTitle: data[0].term
            }
             
          });
        });
        
      } else {
        res.redirect('/404');
      }
    }).catch(function (error) {
      res.redirect('/404');
    });
  },

  reRoute: function (req, res, next) {
    var id = req.param('id') || '';
    KnowledgeBaseArticleService.findPublishedById(id).then(function(article) {
      KnowledgeBaseTopicService.findById(article.topic).then(function(response) {
        var uri = '/knowledge/' + ViewFilterService.urlEncode(response.name) + "/" +  ViewFilterService.urlEncode(article.term)
        res.redirect(uri);
      }).catch(function (error) {
        res.redirect('/404');
      });  
    }).catch(function (error) {
      res.redirect('/404');
    });
  },

  saveFeedback: function (req, res) {
    var helpful = req.param('helpful');
    var articleId = req.param('articleId');
    KnowledgeBaseArticleService.createFeedback(helpful, articleId).then(function (feedback) {
      res.send({
        status: 'success',
        message: ''
      });
    }).catch(function (error) {
      res.send({
        status: 'failed',
        message: 'Unable to save feedback'
      });
    })
  }
};

