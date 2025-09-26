require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('../supabaseClient');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- GET: Получить все стартовые данные (категории и фразы) ---
app.get('/api/initial-data', async (req, res) => {
    try {
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('*');

        if (categoriesError) throw categoriesError;

        const { data: phrasesData, error: phrasesError } = await supabase
            .from('phrases')
            .select('*');

        if (phrasesError) throw phrasesError;
        
        const phrases = phrasesData.map(p => ({
            id: p.id,
            russian: p.russian,
            german: p.german,
            category: p.category_id,
            transcription: p.transcription,
            context: p.context,
            masteryLevel: 0, // Default values for frontend
            lastReviewedAt: null,
            nextReviewAt: Date.now(),
            knowCount: 0,
            knowStreak: 0,
            isMastered: false,
            lapses: 0,
            distractors: p.distractors,
        }));

        res.json({ categories, phrases });

    } catch (error) {
        console.error('Error fetching initial data:', error);
        res.status(500).json({ error: 'Failed to fetch initial data', details: error.message });
    }
});

// --- POST: Создать новую фразу ---
app.post('/api/phrases', async (req, res) => {
    const { russian, german, category_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('phrases')
            .insert([{ russian, german, category_id }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating phrase:', error);
        res.status(500).json({ error: 'Failed to create phrase', details: error.message });
    }
});

// --- PUT: Обновить фразу ---
app.put('/api/phrases/:id', async (req, res) => {
    const { id } = req.params;
    const { russian, german, category_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('phrases')
            .update({ russian, german, category_id })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error(`Error updating phrase ${id}:`, error);
        res.status(500).json({ error: 'Failed to update phrase', details: error.message });
    }
});

// --- DELETE: Удалить фразу ---
app.delete('/api/phrases/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('phrases')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting phrase ${id}:`, error);
        res.status(500).json({ error: 'Failed to delete phrase', details: error.message });
    }
});

// --- POST: Создать новую категорию ---
app.post('/api/categories', async (req, res) => {
    const { id, name, color, is_foundational } = req.body;
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ id, name, color, is_foundational }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category', details: error.message });
    }
});

// --- PUT: Обновить категорию ---
app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    try {
        const { data, error } = await supabase
            .from('categories')
            .update({ name, color })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        res.status(500).json({ error: 'Failed to update category', details: error.message });
    }
});

// --- DELETE: Удалить категорию ---
app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { migrationTargetId } = req.body;

    try {
        // Если есть фразы для миграции, обновляем их
        if (migrationTargetId) {
            const { error: updateError } = await supabase
                .from('phrases')
                .update({ category_id: migrationTargetId })
                .eq('category_id', id);
            if (updateError) throw updateError;
        } else {
            // Иначе (или если миграция не нужна), удаляем связанные фразы
            const { error: deletePhrasesError } = await supabase
                .from('phrases')
                .delete()
                .eq('category_id', id);
            if (deletePhrasesError) throw deletePhrasesError;
        }

        // Удаляем саму категорию
        const { error: deleteCategoryError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (deleteCategoryError) throw deleteCategoryError;

        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

// Экспорт для Vercel
module.exports = app;