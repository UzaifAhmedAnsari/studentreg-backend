        // backend/routes/registrationRoutes.js
        const express = require('express');
        const router = express.Router();
        const { protect, authorize } = require('../middleware/authMiddleware');
        const Registration = require('../models/Registration');
        const Course = require('../models/Course'); // Course model import kiya

        // @desc    Register a student for a course
        // @route   POST /api/registrations
        // @access  Private/Student
        router.post('/', protect, authorize(['Student']), async (req, res) => {
          const { courseId } = req.body;

          try {
            const existingRegistration = await Registration.findOne({ user: req.user.id, course: courseId });
            if (existingRegistration) {
              return res.status(400).json({ message: 'You are already registered for this course' });
            }

            const registration = new Registration({
              user: req.user.id,
              course: courseId,
            });

            const createdRegistration = await registration.save();
            res.status(201).json(createdRegistration);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        });

        // @desc    Get courses registered by the logged-in student
        // @route   GET /api/registrations/my-courses
        // @access  Private/Student
        router.get('/my-courses', protect, authorize(['Student']), async (req, res) => {
          try {
            const registrations = await Registration.find({ user: req.user.id }).populate('course');
            const courses = registrations.map(reg => reg.course);
            res.json(courses);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        });

        // @desc    Delete a registration (e.g., admin or student unregister)
        // @route   DELETE /api/registrations/:id
        // @access  Private/Admin, Student (for their own)
        router.delete('/:id', protect, async (req, res) => {
          try {
            const registration = await Registration.findById(req.params.id);

            if (!registration) {
              return res.status(404).json({ message: 'Registration not found' });
            }

            // Allow admin to delete any registration, or student to delete their own
            if (req.user.role !== 'Admin' && registration.user.toString() !== req.user.id) {
              return res.status(401).json({ message: 'Not authorized to delete this registration' });
            }

            await registration.deleteOne();
            res.json({ message: 'Registration removed' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        });

        module.exports = router;
        