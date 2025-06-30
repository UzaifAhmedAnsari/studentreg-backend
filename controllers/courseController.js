// controllers/courseController.js
const Course = require('../models/Course');
const Registration = require('../models/Registration'); // Registration model import kiya

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Instructor, Admin)
exports.createCourse = async (req, res) => {
    const { title, description } = req.body;
    try {
        const course = await Course.create({
            title,
            description,
            instructor: req.user._id,
            instructorName: req.user.name
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: 'Course creation failed', error: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
    try {
        // Populate instructor to get name and email
        const courses = await Course.find({}).populate('instructor', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Owner Instructor, Admin)
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the course instructor or an admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'User not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: 'Course update failed', error: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Owner Instructor, Admin)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'User not authorized to delete this course' });
        }
        
        // Note: In a real app, you might want to consider deleting related registrations here
        // or setting a flag that the course is no longer active.
        await course.deleteOne(); // Use deleteOne() instead of remove()
        res.status(200).json({ message: 'Course removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all registrations for a specific course
// @route   GET /api/courses/:id/registrations
// @access  Private (Owner Instructor, Admin)
exports.getCourseRegistrations = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Ensure only the instructor who owns the course or an Admin can view registrations
        if (req.user.role !== 'Admin' && course.instructor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view registrations for this course' });
        }

        const registrations = await Registration.find({ course: req.params.id }).populate('student', 'name email role');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
