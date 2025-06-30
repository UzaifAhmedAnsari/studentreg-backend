    // backend/routes/adminRoutes.js
    const express = require('express');
    const router = express.Router();
    const { protect, authorize } = require('../middleware/authMiddleware');
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Registration = require('../models/Registration');

    // @desc    Get admin dashboard stats
    // @route   GET /api/admin/dashboard-stats
    // @access  Private/Admin
    router.get('/dashboard-stats', protect, authorize(['Admin']), async (req, res) => {
      try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'Student' });
        const totalInstructors = await User.countDocuments({ role: 'Instructor' });
        const totalCourses = await Course.countDocuments();
        const totalRegistrations = await Registration.countDocuments();

        res.json({
          totalUsers,
          totalStudents,
          totalInstructors,
          totalCourses,
          totalRegistrations,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Get all users
    // @route   GET /api/admin/users
    // @access  Private/Admin
    router.get('/users', protect, authorize(['Admin']), async (req, res) => {
      try {
        const users = await User.find({});
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Update user role
    // @route   PUT /api/admin/users/:id
    // @access  Private/Admin
    router.put('/users/:id', protect, authorize(['Admin']), async (req, res) => {
      try {
        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Admin cannot change their own role or delete themselves for safety
        if (user._id.toString() === req.user.id) {
          return res.status(400).json({ message: 'Admin cannot modify their own account via this route' });
        }

        user.role = req.body.role || user.role;
        await user.save();
        res.json({ message: 'User role updated successfully', user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Delete a user
    // @route   DELETE /api/admin/users/:id
    // @access  Private/Admin
    router.delete('/users/:id', protect, authorize(['Admin']), async (req, res) => {
      try {
        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Admin cannot delete themselves for safety
        if (user._id.toString() === req.user.id) {
          return res.status(400).json({ message: 'Admin cannot delete their own account' });
        }

        await user.deleteOne(); // Use deleteOne()
        res.json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // Existing courses route...
    router.get('/courses', protect, authorize(['Admin']), async (req, res) => {
      try {
        const courses = await Course.find({});
        res.json(courses);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    module.exports = router;
    