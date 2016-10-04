const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the Campaign data will be stored in MongoDB
const CommentSchema = new mongoose.Schema({
        userName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        campaignID: {
            type: String,
            required: true
        }
        
    },
{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Comment', CommentSchema);