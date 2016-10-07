const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the Likes data will be stored in MongoDB
const LikeSchema = new mongoose.Schema({
        userEmail: {
            type: String,
            required: true
        },
        campaignId: {
            type: String,
            required: true
        }
    },
    {
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.

});

module.exports = mongoose.model('Like', LikeSchema);