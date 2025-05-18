const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  timeIn: { type: String },
  timeOut: { type: String, default: null },
  hours: { type: String, default: null }, 
  date: { type: String },
  company: String,
  approved: { type: Boolean, default: false },
  denied: { type: Boolean, default: false },
  submitted: {type: Boolean, default: false}
});

module.exports = mongoose.model('Attendance', attendanceSchema);
