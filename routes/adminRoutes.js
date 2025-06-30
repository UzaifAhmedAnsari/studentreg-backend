// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { is } = require('../middleware/roleMiddleware');

router.use(protect, is('Admin')); // Protect all routes in this file and ensure user is Admin

router.get('/stats', getStats);
router.get('/users', getAllUsers);

module.exports = router;