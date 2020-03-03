module.exports = {
    
    attributes: {
    
        name: {
            type: 'string',
            required: true
        },

        tagline: {
            type: 'string',
        },

        bodyHTML: {
            type: 'longtext'
        },

        slug: {
            type: 'string',
            required: true,
            unique: true
        },

        author: {
            model: 'User'
        },

        headerImageUrl: {
            type: 'string'
        },

        headerImageAlt: {
            type: 'string'
        },

        previewImageUrl: {
            type: 'string'
        },

        previewImageAlt: {
            type: 'string'
        },

    },

    validationMessages: {
        name: {
            required: 'Video Category name is required'
        }
    }
};
    