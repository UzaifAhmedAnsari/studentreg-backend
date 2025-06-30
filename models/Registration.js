// models/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
}, { timestamps: true });

// Ensure a student can only register for a course once
RegistrationSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);