const supabase = require('../../supabaseClient');
const { getAllCategories } = require('./categoriesService');
const { getAllPhrases } = require('./phrasesService');
const { createCategory } = require('./categoriesService');
const { createPhrase } = require('./phrasesService');
const fs = require('fs');
const path = require('path');

async function getInitialData(userId) {
    const categories = await getAllCategories(userId);
    const phrasesData = await getAllPhrases(userId);

    const phrases = phrasesData.map(p => ({
        id: p.id,
        russian: p.russian,
        german: p.german,
        category: p.category_id,
        transcription: p.transcription,
        context: p.context,
        masteryLevel: p.masteryLevel || 0,
        lastReviewedAt: p.lastReviewedAt,
        nextReviewAt: p.nextReviewAt || Date.now(),
        knowCount: p.knowCount || 0,
        knowStreak: p.knowStreak || 0,
        isMastered: p.isMastered || false,
        lapses: p.lapses || 0,
    }));

    return { categories, phrases };
}

async function loadInitialData(userId) {
    const filePath = path.join(__dirname, '../../data/initial-data.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const ruData = data.data.ru;

    // Create mapping of old category ids to new category ids
    const categoryMapping = {};

    // Load categories first
    for (const category of ruData.categories) {
        // Check if category already exists for the user
        const { data: existingCategory, error: checkError } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', userId)
            .eq('name', category.name)
            .single();

        let categoryId;
        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const newCategory = await createCategory(userId, {
                name: category.name,
                color: category.color,
                is_foundational: category.isFoundational !== undefined ? category.isFoundational : false
            });
            categoryId = newCategory.id;
        }
        categoryMapping[category.id] = categoryId;
    }

    // Load phrases
    for (const phrase of ruData.phrases) {
        const categoryId = categoryMapping[phrase.category];
        if (categoryId) {
            await createPhrase(userId, {
                russian: phrase.russian,
                german: phrase.german,
                category_id: categoryId,
                transcription: phrase.transcription,
                context: phrase.context
            });
        }
    }

    return { message: 'Initial data loaded successfully' };
}

module.exports = {
    getInitialData,
    loadInitialData
};