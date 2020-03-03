/**
 * FrequentlyAskedQuestionFeedback.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    helpful: {
      type: 'boolean',
      required: true
    },

    faq: {
      model: 'FrequentlyAskedQuestion'
    },

    authorId: {
      type: 'integer'
    }

  },

  validationMessages: {
    helpful: {
      required: 'Feedback is required'
    }
  }
};

