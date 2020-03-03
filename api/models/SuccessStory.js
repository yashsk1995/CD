/**
 * SuccessStory.js
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

    detailHTML: {
      type: 'longtext'
    },

    bodyHTML: {
      type: 'longtext'
    },

    slug: {
      type: 'string'
    },

    previewImageUrl: {
      type: 'string'
    },

    pageTitle: {
      type: 'string'
    },

    purposeTags:{
      type: 'string'
    },

    propertyTypeTags: {
      type: 'string'
    },

    locationTags: {
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

