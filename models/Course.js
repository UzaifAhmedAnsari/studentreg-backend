    // backend/models/Course.js
    const mongoose = require('mongoose');

    const lectureSchema = mongoose.Schema(
      {
        title: { type: String, required: true },
        videoUrl: { type: String, required: false }, // Video URL
        content: { type: String, required: false },  // Text content
        resources: [{ type: String }],               // Array of resource URLs/links
      },
      {
        timestamps: true,
      }
    );

    const moduleSchema = mongoose.Schema(
      {
        title: { type: String, required: true },
        lectures: [lectureSchema], // Array of lectures
      },
      {
        timestamps: true,
      }
    );

    const courseSchema = mongoose.Schema(
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
        // imageUrl: { // <-- Yeh field remove kar diya hai
        //   type: String,
        //   required: false,
        // },
        category: {
          type: String,
          required: false,
          default: 'General',
        },
        modules: [moduleSchema],
      },
      {
        timestamps: true,
      }
    );

    const Course = mongoose.model('Course', courseSchema);

    module.exports = Course;
    