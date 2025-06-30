// routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const { registerForCourse, getMyCourses } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { is } = require('../middleware/roleMiddleware');

router.route('/')
    .post(protect, is('Student'), registerForCourse);
    
router.route('/my-courses')
    .get(protect, is('Student'), getMyCourses);

module.exports = router;