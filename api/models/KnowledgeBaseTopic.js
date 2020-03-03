/**
 * KnowledgeBaseTopic.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },

    // slug: {
    //   type: 'string',
    //   required: true,
    //   unique: true
    // },

    author : {
      model: 'User'
    },

    articles: {
      collection: 'KnowledgeBaseArticle',
      via : 'topic'
    }
  },

  validationMessages: {
    name: {
      required: 'Topic name is required',
      unique: 'Topic name already exist'
    }
  }
};
