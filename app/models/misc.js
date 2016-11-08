const mongoose = require('mongoose');

// Schema defines how the Campaign data will be stored in MongoDB
const MiscSchema = new mongoose.Schema({
        title: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        }
    },
{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Misc', MiscSchema);