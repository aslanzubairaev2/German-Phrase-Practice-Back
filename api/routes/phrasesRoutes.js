const express = require('express');
const router = express.Router();
const { createPhraseHandler, updatePhraseHandler, deletePhraseHandler } = require('../controllers/phrasesController');
const { validatePhrase } = require('../middleware/validation');

router.post('/', validatePhrase, createPhraseHandler);
router.put('/:id', validatePhrase, updatePhraseHandler);
router.delete('/:id', deletePhraseHandler);

module.exports = router;