// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseRegistrations // Naya function import kiya
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { is } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, is('Admin', 'Instructor'), createCourse)
    .get(getAllCourses); // Public route for getting all courses

router.route('/:id')
    .get(getCourseById) // Public route for getting single course
    .put(protect, is('Admin', 'Instructor'), updateCourse)
    .delete(protect, is('Admin', 'Instructor'), deleteCourse);

// Naya route instructors ya admins ke liye course ke enrollments dekhne ke liye
router.get('/:id/registrations', protect, is('Admin', 'Instructor'), getCourseRegistrations);

module.exports = router;
