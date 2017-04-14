const mongoose = require('mongoose');

// Schema defines how the Campaign data will be stored in MongoDB
const SkillSchema = new mongoose.Schema({
        answer: {
            type: String,
            required: true
        },
        questionNumber: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        dateCreated:{
            type: String,
            required:true
        },
        questionStep:{
            type: String,
            required: true
        }
    },
{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Skill', SkillSchema);