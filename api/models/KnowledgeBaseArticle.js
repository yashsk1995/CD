/**
 * KnowledgeBaseArticle.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


module.exports = {

  attributes: {

    publishedAt: {
      type: 'datetime'
    },

    term: {
      type: 'string',
      required: true
    },

    // slug: {
    //   type: 'string',
    //   required: true,
    //   unique: true
    // },

    description: {
      type: 'longtext'
    },

    status: {
      type: 'string'
    },

    topic: {
      model: 'KnowledgeBaseTopic',
      required: true
    },

    author: {
      model: 'User'
    }
  },
  validationMessages: {
    term: {
      required: 'Article term is required'
    },
    topic: {
      required: 'Topic is required'
    }

  }
};
