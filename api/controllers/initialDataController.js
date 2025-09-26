const { getInitialData } = require('../services/initialDataService');

async function getInitialDataHandler(req, res) {
    try {
        const data = await getInitialData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching initial data:', error);
        res.status(500).json({ error: 'Failed to fetch initial data', details: error.message });
    }
}

module.exports = {
    getInitialDataHandler
};