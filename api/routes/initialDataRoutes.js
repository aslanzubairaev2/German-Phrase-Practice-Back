const express = require('express');
const router = express.Router();
const { getInitialDataHandler } = require('../controllers/initialDataController');

router.get('/initial-data', getInitialDataHandler);

module.exports = router;