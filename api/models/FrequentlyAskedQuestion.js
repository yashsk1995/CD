/**
 * FrequentlyAskedQuestion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    question: {
      type: 'string',
      required: true
    },

    answer: {
      type: 'string',
      required: true
    },

    status: {
      type: 'string'
    },

    publishedAt: {
      type: 'datetime'
    },

    author: {
      model: 'User'
    }

  },

  validationMessages: {
    question: {
      required: 'Question is required'
    },
    answer: {
      required: 'Answer is required'
    }
  }
};

