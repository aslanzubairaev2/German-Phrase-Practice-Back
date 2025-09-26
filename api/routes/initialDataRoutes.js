const express = require('express');
const router = express.Router();
const { getInitialDataHandler, loadInitialDataHandler } = require('../controllers/initialDataController');

router.get('/initial-data', getInitialDataHandler);
router.post('/initial-data', loadInitialDataHandler);

module.exports = router;