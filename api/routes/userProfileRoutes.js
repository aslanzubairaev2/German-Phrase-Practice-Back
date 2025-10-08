const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfileHandler, updateUserProfileHandler, upsertUserProfileHandler } = require('../controllers/userProfileController');

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/', getUserProfileHandler);

// Update user profile
router.put('/', updateUserProfileHandler);

// Upsert user profile (create or update)
router.post('/', upsertUserProfileHandler);

module.exports = router;
