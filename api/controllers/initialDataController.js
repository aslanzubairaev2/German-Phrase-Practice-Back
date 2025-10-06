const { getInitialData, loadInitialData } = require('../services/initialDataService');

async function getInitialDataHandler(req, res) {
    try {
        const userId = req.user.id;
        console.log(`Handling initial data request for user: ${userId}`);
        const data = await getInitialData(userId);
        res.json(data);
    } catch (error) {
        console.error('Error fetching initial data:', error);
        // Provide more specific error messages based on error type
        let statusCode = 500;
        let message = 'Failed to fetch initial data';
        if (error.message.includes('JWT')) {
            statusCode = 401;
            message = 'Authentication error';
        } else if (error.message.includes('connection') || error.message.includes('network')) {
            statusCode = 503;
            message = 'Database connection error';
        }
        res.status(statusCode).json({
            error: message,
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

async function loadInitialDataHandler(req, res) {
    try {
        const userId = req.user.id;
        console.log(`Handling load initial data request for user: ${userId}`);
        const result = await loadInitialData(userId);
        res.json(result);
    } catch (error) {
        console.error('Error loading initial data:', error);
        let statusCode = 500;
        let message = 'Failed to load initial data';
        if (error.message.includes('file') || error.message.includes('JSON')) {
            statusCode = 400;
            message = 'Invalid data file';
        } else if (error.message.includes('connection')) {
            statusCode = 503;
            message = 'Database connection error';
        }
        res.status(statusCode).json({
            error: message,
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

module.exports = {
    getInitialDataHandler,
    loadInitialDataHandler
};