/**
 * VideoPost.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    
      attributes: {
    
        publishedAt: {
          type: 'datetime'
        },
    
        name: {
          type: 'string',
          required: true,
          unique: true
        },
    
        bodyHTML: {
          type: 'longtext'
        },

        videoTranscript: {
          type: 'longtext'
        },
    
        slug: {
          type: 'string',
          required: true,
        },

        videoUrl: {
          type: 'string',
          required: true,
          unique: true
        },
    
        pageTitle: {
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
    
        category: {
          type: 'string'
        },
    
        authorId: {
          type: 'integer'
        },
    
        authorName: {
          type: 'string'
        },
        previewImageUrl: {
          type: 'string'
         },
    
      },
    
      validationMessages: {
        title: {
          required: 'Title is required',
          unique: 'Video Post with same title already exist'
        },
        slug: {
          required: 'Slug is required',
          unique: 'Video Post with same slug already exist'
        }
      }
    };
    
    