const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  content: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  company: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journal', journalSchema);
