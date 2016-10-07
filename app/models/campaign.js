const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the Campaign data will be stored in MongoDB
const CampaignSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        type: {
            type: String,
            enum: ['Campaign', 'Freebies', 'Advert'],
            default: 'Campaign'
        },
        description: {
            type: String,
            required: true
        },
        enabled:{
            type: Boolean,
            required:true
        },
        expiring:{
            type: Date,
            required:true
        },
        likes: {
            type:[String]
        },
        image:{
            type: String
        },
        thumbnail:{
            type:String
        },
        tags:{
            type: [String],
            required:true
        },
        wantin:{
            type:[String]
        },
        share:{
            type:Number
        }
    },
{
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Campaign', CampaignSchema);