const express = require('express');
const router = express.Router();
const { createPhraseHandler, updatePhraseHandler, deletePhraseHandler } = require('../controllers/phrasesController');

router.post('/', createPhraseHandler);
router.put('/:id', updatePhraseHandler);
router.delete('/:id', deletePhraseHandler);

module.exports = router;