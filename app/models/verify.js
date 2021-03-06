const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the VerifySchema data will be stored in MongoDB
const VerifySchema = new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    token: {
        type:Number,
        required:true
    }
    },
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Verify', VerifySchema);