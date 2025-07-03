const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "plaintext",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Snippet', snippetSchema);
