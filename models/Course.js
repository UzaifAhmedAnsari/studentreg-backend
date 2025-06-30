// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  instructorName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);