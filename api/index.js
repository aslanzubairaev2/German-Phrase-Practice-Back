require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Импортировать роуты
const phrasesRoutes = require('./routes/phrasesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const initialDataRoutes = require('./routes/initialDataRoutes');

// Использовать роуты
app.use('/api/phrases', phrasesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api', initialDataRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Экспорт для Vercel
module.exports = app;