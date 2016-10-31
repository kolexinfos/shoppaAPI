const mongoose = require('mongoose');

// Schema defines how the Campaign data will be stored in MongoDB
const BrandSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        enabled:{
            type: Boolean,
            required:true
        },
        image:{
            type: String,
            required: true
        },
        tags:{
            type: [String]
        },
        likes:{
            type:Array,
            default: []
        }
    },
{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Brand', BrandSchema);