const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Language code to full name mapping
const LANGUAGE_NAMES = {
    en: 'English',
    de: 'German',
    ru: 'Russian',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    pl: 'Polish',
    zh: 'Chinese',
    ja: 'Japanese',
    ar: 'Arabic',
    hi: 'Hindi'
};

// Non-European languages that need transcription
const NEEDS_TRANSCRIPTION = ['zh', 'ja', 'ar', 'ru', 'hi'];

/**
 * Generate translated initial data for a specific language pair
 * @param {string} nativeLanguage - Native language code (e.g., 'ru')
 * @param {string} learningLanguage - Learning language code (e.g., 'de')
 * @returns {Promise<{categories: Array, phrases: Array}>}
 */
async function generateInitialData(nativeLanguage, learningLanguage) {
    try {
        console.log(`Generating initial data for ${nativeLanguage} → ${learningLanguage}`);

        // Load English template
        const templatePath = path.join(__dirname, '../../data/initial-data-template.json');
        const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

        const nativeLangName = LANGUAGE_NAMES[nativeLanguage] || nativeLanguage;
        const learningLangName = LANGUAGE_NAMES[learningLanguage] || learningLanguage;

        // Translate categories
        const translatedCategories = await translateCategories(
            templateData.categories,
            nativeLangName
        );

        // Translate phrases in batches
        const translatedPhrases = await translatePhrases(
            templateData.phrases,
            nativeLangName,
            learningLangName,
            NEEDS_TRANSCRIPTION.includes(learningLanguage)
        );

        console.log(`Successfully generated ${translatedCategories.length} categories and ${translatedPhrases.length} phrases`);

        return {
            categories: translatedCategories,
            phrases: translatedPhrases
        };
    } catch (error) {
        console.error('Error generating initial data:', error);
        throw error;
    }
}

/**
 * Translate category names using Gemini AI
 * @param {Array} categories - Array of category objects from template
 * @param {string} targetLanguage - Target language name
 * @returns {Promise<Array>}
 */
async function translateCategories(categories, targetLanguage) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const categoryNames = categories.map(c => c.name).join('\n');

    const prompt = `Translate the following category names to ${targetLanguage}.
Return ONLY a JSON array of translated names in the exact same order, without any additional text or formatting.

Category names:
${categoryNames}

Example output format: ["Translated Name 1", "Translated Name 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const translatedNames = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

    // Map back to category objects
    return categories.map((cat, index) => ({
        id: cat.id,
        name: translatedNames[index],
        color: cat.color,
        isFoundational: cat.isFoundational
    }));
}

/**
 * Translate phrases using Gemini AI in batches
 * @param {Array} phrases - Array of phrase objects from template
 * @param {string} nativeLanguage - Native language name
 * @param {string} learningLanguage - Learning language name
 * @param {boolean} needsTranscription - Whether to generate transcription
 * @returns {Promise<Array>}
 */
async function translatePhrases(phrases, nativeLanguage, learningLanguage, needsTranscription) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const batchSize = 20; // Process 20 phrases at a time
    const translatedPhrases = [];

    for (let i = 0; i < phrases.length; i += batchSize) {
        const batch = phrases.slice(i, i + batchSize);
        console.log(`Translating phrases batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(phrases.length / batchSize)}`);

        const phrasesText = batch.map((p, idx) => `${idx + 1}. ${p.english}`).join('\n');

        const prompt = `Translate the following English phrases to both ${nativeLanguage} and ${learningLanguage}.
${needsTranscription ? `Also provide romanized transcription for ${learningLanguage}.` : ''}

Return ONLY a JSON array of objects with this exact structure:
[
  {
    "native": "${nativeLanguage} translation",
    "learning": "${learningLanguage} translation"${needsTranscription ? ',\n    "transcription": "romanized transcription"' : ''}
  }
]

Phrases to translate:
${phrasesText}

IMPORTANT:
- Return ONLY valid JSON, no additional text
- Maintain the exact same order
- Ensure translations are accurate and natural
${needsTranscription ? `- Transcription should use Latin alphabet (romanization)` : ''}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON response
        const translations = JSON.parse(response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // Map back to phrase objects with category and context
        const batchTranslated = batch.map((phrase, idx) => ({
            category: phrase.category,
            native: translations[idx].native,
            learning: translations[idx].learning,
            transcription: translations[idx].transcription || undefined,
            context: phrase.context
        }));

        translatedPhrases.push(...batchTranslated);

        // Small delay to avoid rate limiting
        if (i + batchSize < phrases.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return translatedPhrases;
}

/**
 * Generate and save initial data to a file (for caching/debugging)
 * @param {string} nativeLanguage - Native language code
 * @param {string} learningLanguage - Learning language code
 * @param {string} outputPath - Path to save the generated data
 * @returns {Promise<void>}
 */
async function generateAndSaveInitialData(nativeLanguage, learningLanguage, outputPath) {
    const data = await generateInitialData(nativeLanguage, learningLanguage);

    const output = {
        metadata: {
            nativeLanguage,
            learningLanguage,
            generatedAt: new Date().toISOString(),
            version: '1.0.0'
        },
        data: {
            categories: data.categories,
            phrases: data.phrases
        }
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`Initial data saved to ${outputPath}`);
}

module.exports = {
    generateInitialData,
    translateCategories,
    translatePhrases,
    generateAndSaveInitialData,
    LANGUAGE_NAMES,
    NEEDS_TRANSCRIPTION
};
