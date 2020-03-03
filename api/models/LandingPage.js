/**
 * LandingPage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true
    },

    body: {
      type: 'longtext'
    },

    fileUrl: {
      type: 'string'
    },

    calculatorType: {
      required: true,
      type: 'string',
    },

    slug: {
      type: 'string'
    },

    pageTitle: {
      type: 'string'
    },

    subtitle: {
      type: 'string'
    },

    localPhotoUrl: {
      type: 'string'
    },

    headerImageUrl: {
      type: 'string'
    },

    metaTags: {
      type: 'string'
    },

    keywords: {
      type: 'string'
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
    title: {
      required: 'Title is required'
    }
  }
};

