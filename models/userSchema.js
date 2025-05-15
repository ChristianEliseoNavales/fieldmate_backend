const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, 
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Student", "Coordinator", "Supervisor"] },
  supervisorNumber: String,
  company: String,
  arrangement: { type: String, enum: ["On-site", "Remote", "Hybrid"] },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
