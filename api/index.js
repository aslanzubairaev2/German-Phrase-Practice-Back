require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler, logger } = require('./middleware/errorHandler');
const { apiLimiter, strictLimiter, readLimiter } = require('./middleware/rateLimit');

const app = express();

// Логирование входящих запросов
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// CORS с ограниченными origins (в продакшене указать конкретные)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || false
    : true, // В разработке разрешить все
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // Ограничение размера тела запроса
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

// Rate limiting
app.use('/api', apiLimiter);

// Импортировать роуты
const phrasesRoutes = require('./routes/phrasesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const initialDataRoutes = require('./routes/initialDataRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Health check без rate limiting
app.use('/health', healthRoutes);

// Использовать роуты
app.use('/api/phrases', phrasesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api', initialDataRoutes);

// Обработка 404
app.use(notFoundHandler);

// Централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Backend server running on http://localhost:${PORT}`, { port: PORT });
});

// Экспорт для Vercel
module.exports = app;