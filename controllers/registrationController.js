// controllers/registrationController.js
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription'); // Subscription model import kiya gaya hai
// const sendEmail = require('../services/emailService'); // Email service remove kar diya gaya hai

// Define subscription limits
const PLAN_LIMITS = {
    'Free': 1, // Free plan users can register for 1 course
    'Basic': 5, // Basic plan users can register for 5 courses
    'Premium': Infinity // Premium plan users have no limit
};

// @desc    Register student for a course
// @route   POST /api/registrations
// @access  Private (Student)
exports.registerForCourse = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user._id;

    try {
        // 1. Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // 2. Check if already registered
        const existingRegistration = await Registration.findOne({ student: studentId, course: courseId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You are already registered for this course' });
        }

        // 3. Check subscription plan limit
        const subscription = await Subscription.findOne({ user: studentId });

        // Agar user ka koi subscription record nahi hai, to usay 'Free' assume karein
        const userPlan = subscription ? subscription.plan : 'Free';
        const limit = PLAN_LIMITS[userPlan];

        const currentRegistrations = await Registration.countDocuments({ student: studentId });

        if (currentRegistrations >= limit) {
            return res.status(403).json({ message: `Your '${userPlan}' plan limit of ${limit} courses has been reached. Please upgrade.` });
        }

        // 4. Create registration
        const registration = await Registration.create({ student: studentId, course: courseId });

        // 5. Send confirmation email (Email functionality remove kar di gayi hai)

        res.status(201).json({ message: 'Successfully registered for the course', registration });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a student's registered courses
// @route   GET /api/registrations/my-courses
// @access  Private (Student)
exports.getMyCourses = async (req, res) => {
    try {
        const registrations = await Registration.find({ student: req.user._id }).populate({
            path: 'course',
            populate: {
                path: 'instructor',
                select: 'name'
            }
        });
        
        const courses = registrations.map(reg => reg.course);
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
