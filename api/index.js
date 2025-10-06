require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('./middleware/rateLimit');
const { validatePhrase, validateCategory } = require('./middleware/validation');

// Применить rate limiting ко всем маршрутам
app.use(rateLimit);

const PORT = process.env.PORT || 3001;

// Импортировать роуты
const phrasesRoutes = require('./routes/phrasesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const initialDataRoutes = require('./routes/initialDataRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

// Использовать роуты
app.use('/api/auth', authRoutes);
app.use('/api/phrases', phrasesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api', initialDataRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware (должен быть последним)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Экспорт для Vercel
module.exports = app;