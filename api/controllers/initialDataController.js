const { getInitialData, loadInitialData } = require('../services/initialDataService');

async function getInitialDataHandler(req, res) {
    try {
        const data = await getInitialData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching initial data:', error);
        res.status(500).json({ error: 'Failed to fetch initial data', details: error.message });
    }
}

async function loadInitialDataHandler(req, res) {
    try {
        const result = await loadInitialData();
        res.json(result);
    } catch (error) {
        console.error('Error loading initial data:', error);
        res.status(500).json({ error: 'Failed to load initial data', details: error.message });
    }
}

module.exports = {
    getInitialDataHandler,
    loadInitialDataHandler
};