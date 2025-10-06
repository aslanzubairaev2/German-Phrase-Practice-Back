const express = require('express');
const router = express.Router();
const { getInitialDataHandler, loadInitialDataHandler } = require('../controllers/initialDataController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

router.get('/initial-data', getInitialDataHandler);
router.post('/initial-data', loadInitialDataHandler);

module.exports = router;