const express = require('express');
const router = express.Router();
const { getInitialDataHandler } = require('../controllers/initialDataController');
const { readLimiter } = require('../middleware/rateLimit');

// GET /api/initial-data - получение начальных данных (легкое ограничение для чтения)
router.get('/initial-data', readLimiter, getInitialDataHandler);

module.exports = router;