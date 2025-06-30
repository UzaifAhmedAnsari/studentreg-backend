    // backend/routes/courseRoutes.js
    const express = require('express');
    const router = express.Router();
    const { protect, authorize } = require('../middleware/authMiddleware');
    const Course = require('../models/Course');

    // @desc    Get all courses
    // @route   GET /api/courses
    // @access  Public
    router.get('/', async (req, res) => {
      try {
        const courses = await Course.find({});
        res.json(courses);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Get single course by ID
    // @route   GET /api/courses/:id
    // @access  Public
    router.get('/:id', async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);
        if (course) {
          res.json(course);
        } else {
          res.status(404).json({ message: 'Course not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Create a new course
    // @route   POST /api/courses
    // @access  Private/Instructor
    router.post('/', protect, authorize(['Instructor']), async (req, res) => {
      const { title, description, price, category, modules } = req.body; // imageUrl hata diya

      try {
        const course = new Course({
          user: req.user._id,
          title,
          description,
          price,
          // imageUrl, // <-- Yeh line hata di hai
          category,
          modules: modules || [],
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Update a course
    // @route   PUT /api/courses/:id
    // @access  Private/Instructor
    router.put('/:id', protect, authorize(['Instructor']), async (req, res) => {
      const { title, description, price, category, modules } = req.body; // imageUrl hata diya

      try {
        const course = await Course.findById(req.params.id);

        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        if (course.user.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        course.price = price !== undefined ? price : course.price;
        // course.imageUrl = imageUrl || course.imageUrl; // <-- Yeh line hata di hai
        course.category = category || course.category;
        course.modules = modules !== undefined ? modules : course.modules;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // @desc    Delete a course
    // @route   DELETE /api/courses/:id
    // @access  Private/Instructor
    router.delete('/:id', protect, authorize(['Instructor']), async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);

        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }

        if (course.user.toString() !== req.user.id) {
          return res.status(401).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();
        res.json({ message: 'Course removed' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    module.exports = router;
    