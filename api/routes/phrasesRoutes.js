const express = require('express');
const router = express.Router();
const { createPhraseHandler, updatePhraseHandler, deletePhraseHandler } = require('../controllers/phrasesController');
const { validatePhrase } = require('../middleware/validation');
const { strictLimiter } = require('../middleware/rateLimit');

// POST /api/phrases - создание фразы (строгое ограничение)
router.post('/', strictLimiter, validatePhrase, createPhraseHandler);

// PUT /api/phrases/:id - обновление фразы (строгое ограничение)
router.put('/:id', strictLimiter, validatePhrase, updatePhraseHandler);

// DELETE /api/phrases/:id - удаление фразы (строгое ограничение)
router.delete('/:id', strictLimiter, deletePhraseHandler);

module.exports = router;