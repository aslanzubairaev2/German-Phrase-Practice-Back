const { getAllCategories } = require('./categoriesService');
const { getAllPhrases } = require('./phrasesService');

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
        masteryLevel: 0, // Default values for frontend
        lastReviewedAt: null,
        nextReviewAt: Date.now(),
        knowCount: 0,
        knowStreak: 0,
        isMastered: false,
        lapses: 0,
        distractors: p.distractors,
    }));

    return { categories, phrases };
}

module.exports = {
    getInitialData
};