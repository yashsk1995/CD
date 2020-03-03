var sails = require('sails');
var elasticsearch = require('elasticsearch');

before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(100000);
  sails.lift({
    models: {
      connection: 'commercialDirectDBTest',
      migrate: 'drop'
    }
  }, function (err) {
    if (err) return done(err);
    var client = new elasticsearch.Client({
      host: sails.config.elastic_search.host
    });

    client.indices.delete({index: sails.config.elastic_search.index}).then(function (response) {
      return response;
    }).catch(function (error) {
      return '';
    }).then(function (response) {
      return BlogCategory.create({name: 'Testing Category 1', author: 1});
    }).then(function (createdCategory) {
      return BlogPost.create({
        publishedAt: new Date(),
        previewImageUrl: 'https://goo.gl/xBsUwW',
        headerImageUrl: 'https://goo.gl/xBsUwW',
        title: 'Testing Blog Post',
        bodyHTML: 'Body HTML',
        slug: 'Slug',
        pageTitle: 'Page Title',
        metaTags: 'tag1,tag2,tag3',
        keywords: 'key1,key2',
        status: 'Published',
        category: createdCategory.name,
        authorId: 1,
        authorName: 'Zeeshan Abbas'
      });
    }).then(function (createdBlog) {
      return FrequentlyAskedQuestion.create({
        question: 'Testing Question 1',
        answer: 'Testing Answer',
        status: 'Published',
        aurhor: 1
      });
    }).then(function (faq) {
      return KnowledgeBaseTopic.create({
        id: 1,
        name: 'Test Topic',
        author: 1
      });
    }).then(function (topic) {
      return KnowledgeBaseArticle.create({
        id: 1,
        term: 'Testing term 1',
        description: 'test description',
        topic: 1,
        status: 'Published',
        author: 1
      });
    }).then(function (article) {
      return SuccessStory.create({
          id: 1,
          title: 'Testing Success Story 1',
          bodyHTML: 'Body HTML',
          slug: 'Slug',
          pageTitle: 'Page Title',
          metaTags: 'tag1:tag2:tag3',
          keywords: 'key1:key2',
          status: 'Published',
          category: 'Testing Category',
          author: 1,
          previewImageUrl: 'https://goo.gl/xBsUwW'
        }
      );
    }).then(function (successStory) {
      return EndUser.create({
        phoneNumber: '5555551234',
        progress: sails.config.app_constants.user_progress.completedCalculator,
        salesForceId: '00Q0R0000036muQ'
      });

    }).then(function (endUser) {
      return User.create({
        name: 'testing 321',
        email: 'test_end@user.com',
        type: sails.config.app_constants.user_types.end_user,
        password: 'test123',
        endUser: endUser.id
      });
    }).then(function (user) {
      return LandingPage.create({
        id: 1,
        title: 'Test Landing Page',
        body: 'Body HTML',
        slug: 'test',
        pageTitle: 'Page Title',
        metaTags: 'tag1:tag2:tag3',
        keywords: 'key1:key2',
        status: 'Published',
        calculatorType: 'simple',
        author: 1,
        localPhotoUrl: 'https://goo.gl/xBsUwW',
        headerImageUrl: 'https://goo.gl/xBsUwW'
      });
    }).then(function (landingPage) {
      return Config.create({
        key: 'loanLookup',
        value: {"Tier I":{"650":{"50":"8.125","55":"8.25","60":"8.375","65":"8.625","70":"8.875","max":"70"},"675":{"50":"7.875","55":"8.125","60":"8.25","65":"8.375","70":"8.5","75":"8.75","max":"75"},"700":{"50":"7.75","55":"7.875","60":"8","65":"8.125","70":"8.25","75":"8.5","80":"8.75","max":"80"},"725":{"50":"7.5","55":"7.625","60":"7.75","65":"7.875","70":"8","75":"8.25","80":"8.5","max":"80"},"750":{"50":"7.25","55":"7.5","60":"7.625","65":"7.75","70":"7.875","75":"8.125","80":"8.375","max":"80"},"775":{"50":"7.125","55":"7.25","60":"7.375","65":"7.5","70":"7.625","75":"7.875","80":"8","max":"80"},"800":{"50":"7.125","55":"7.25","60":"7.25","65":"7.375","70":"7.5","75":"7.75","80":"7.875","max":"80"}},"Tier II":{"650":{"50":"8.25","55":"8.375","60":"8.5","65":"8.75","70":"9","max":"70"},"675":{"50":"8","55":"8.25","60":"8.375","65":"8.5","70":"8.625","75":"8.875","max":"75"},"700":{"50":"7.875","55":"8","60":"8.125","65":"8.25","70":"8.375","75":"8.625","max":"75"},"725":{"50":"7.625","55":"7.75","60":"7.875","65":"8","70":"8.125","75":"8.375","80":"8.625","max":"80"},"750":{"50":"7.375","55":"7.625","60":"7.75","65":"7.875","70":"8","75":"8.25","80":"8.5","max":"80"},"775":{"50":"7.25","55":"7.375","60":"7.5","65":"7.625","70":"7.75","75":"8","80":"8.25","max":"80"},"800":{"50":"7.25","55":"7.375","60":"7.375","65":"7.5","70":"7.625","75":"7.875","80":"8.125","max":"80"}}}
      })
    }).then(function (configs) {
      done(err, sails);
    });


  });
})
;

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
