const mongoose = require('mongoose');

// Schema defines how chat messages will be stored in MongoDB
const GroupSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true
    },
    Type: {
      type: String,
      required: true
    },
    description: {
      type: String

    }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Group', GroupSchema);
