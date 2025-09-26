const { getAllCategories } = require('./categoriesService');
const { getAllPhrases } = require('./phrasesService');
const { createCategory } = require('./categoriesService');
const { createPhrase } = require('./phrasesService');
const fs = require('fs');
const path = require('path');

async function getInitialData() {
    const categories = await getAllCategories();
    const phrasesData = await getAllPhrases();

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

async function loadInitialData() {
    const filePath = path.join(__dirname, '../../data/initial-data.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const ruData = data.data.ru;

    // Create mapping of old category ids to new category ids
    const categoryMapping = {};

    // Load categories first
    for (const category of ruData.categories) {
        const newCategory = await createCategory({
            name: category.name,
            color: category.color,
            is_foundational: category.isFoundational !== undefined ? category.isFoundational : false
        });
        categoryMapping[category.id] = newCategory.id;
    }

    // Load phrases
    for (const phrase of ruData.phrases) {
        const categoryId = categoryMapping[phrase.category];
        if (categoryId) {
            await createPhrase({
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