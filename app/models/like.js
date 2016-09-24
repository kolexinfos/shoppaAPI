const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the Likes data will be stored in MongoDB
const LikeSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    campaignId: {
        type: ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Like', LikeSchema);