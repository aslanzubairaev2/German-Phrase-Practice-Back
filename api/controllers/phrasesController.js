const { createPhrase, updatePhrase, deletePhrase } = require('../services/phrasesService');

async function createPhraseHandler(req, res) {
    try {
        const userId = req.user.id;
        const data = await createPhrase(userId, req.body);
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating phrase:', error);
        res.status(500).json({ error: 'Failed to create phrase', details: error.message });
    }
}

async function updatePhraseHandler(req, res) {
    try {
        const userId = req.user.id;
        const data = await updatePhrase(userId, req.params.id, req.body);
        res.json(data);
    } catch (error) {
        console.error(`Error updating phrase ${req.params.id}:`, error);
        const status = error.status || 500;
        res.status(status).json({ error: 'Failed to update phrase', details: error.message });
    }
}

async function deletePhraseHandler(req, res) {
    try {
        const userId = req.user.id;
        await deletePhrase(userId, req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting phrase ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to delete phrase', details: error.message });
    }
}

module.exports = {
    createPhraseHandler,
    updatePhraseHandler,
    deletePhraseHandler
};