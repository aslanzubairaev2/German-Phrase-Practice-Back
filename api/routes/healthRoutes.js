const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient');

// Health check эндпоинт
router.get('/health', async (req, res) => {
  try {
    // Проверяем подключение к Supabase
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
      },
      error: error.message,
    });
  }
});

module.exports = router;