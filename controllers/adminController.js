// controllers/adminController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Registration = require('../models/Registration');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const courseCount = await Course.countDocuments();
        const registrationCount = await Registration.countDocuments();

        const studentCount = await User.countDocuments({ role: 'Student' });
        const instructorCount = await User.countDocuments({ role: 'Instructor' });

        res.status(200).json({
            users: {
                total: userCount,
                students: studentCount,
                instructors: instructorCount,
            },
            courses: courseCount,
            registrations: registrationCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};