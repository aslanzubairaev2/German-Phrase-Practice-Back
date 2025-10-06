const express = require('express');
const router = express.Router();
const { createPhraseHandler, updatePhraseHandler, deletePhraseHandler } = require('../controllers/phrasesController');
const { validatePhrase } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

router.post('/', validatePhrase, createPhraseHandler);
router.put('/:id', validatePhrase, updatePhraseHandler);
router.delete('/:id', deletePhraseHandler);

module.exports = router;