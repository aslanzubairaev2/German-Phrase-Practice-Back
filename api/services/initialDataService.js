const supabase = require('../../supabaseClient');
const { getAllCategories } = require('./categoriesService');
const { getAllPhrases } = require('./phrasesService');
const { createCategory } = require('./categoriesService');
const { createPhrase } = require('./phrasesService');
const { getUserProfile } = require('./userProfileService');
const { generateInitialData } = require('./generateInitialDataService');
const fs = require('fs');
const path = require('path');

async function getInitialData(supabaseClient, userId) {
    try {
        console.log(`Fetching initial data for userId: ${userId}`);
        const categories = await getAllCategories(supabaseClient, userId);
        console.log(`Fetched ${categories.length} categories`);
        const phrasesData = await getAllPhrases(supabaseClient, userId);
        console.log(`Fetched ${phrasesData.length} phrases`);

        const phrases = phrasesData.map(p => ({
            id: p.id,
            native: p.native_text,
            learning: p.learning_text,
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
    } catch (error) {
        console.error('Error in getInitialData:', error);
        throw error; // Re-throw to let controller handle it
    }
}

async function loadInitialData(supabaseClient, userId) {
    try {
        console.log(`Loading initial data for userId: ${userId}`);

        // Get user's language profile
        const profile = await getUserProfile(supabaseClient, userId);

        if (!profile) {
            throw new Error('User profile not found. Please set up your language preferences first.');
        }

        console.log(`Generating initial data for ${profile.native_language} → ${profile.learning_language}`);

        // Generate translated data using AI
        const { categories, phrases } = await generateInitialData(
            profile.native_language,
            profile.learning_language
        );

        // Create mapping of template category ids to new database category ids
        const categoryMapping = {};

        // Load categories first
        for (const category of categories) {
            // Check if category already exists for the user
            const { data: existingCategory, error: checkError } = await supabaseClient
                .from('categories')
                .select('id')
                .eq('user_id', userId)
                .eq('name', category.name)
                .single();

            let categoryId;
            if (existingCategory) {
                categoryId = existingCategory.id;
                console.log(`Category "${category.name}" already exists with id ${categoryId}`);
            } else {
                const newCategory = await createCategory(supabaseClient, userId, {
                    name: category.name,
                    color: category.color,
                    is_foundational: category.isFoundational !== undefined ? category.isFoundational : false
                });
                categoryId = newCategory.id;
                console.log(`Created category "${category.name}" with id ${categoryId}`);
            }
            categoryMapping[category.id] = categoryId;
        }

        // Load phrases
        let createdCount = 0;
        let errorCount = 0;
        for (const phrase of phrases) {
            const categoryId = categoryMapping[phrase.category];
            if (categoryId) {
                try {
                    await createPhrase(supabaseClient, userId, {
                        native_text: phrase.native,
                        learning_text: phrase.learning,
                        category_id: categoryId,
                        transcription: phrase.transcription,
                        context: phrase.context
                    });
                    createdCount++;
                } catch (phraseError) {
                    errorCount++;
                    console.error(`Failed to create phrase: "${phrase.native}" -> "${phrase.learning}"`, phraseError.message);
                }
            }
        }

        if (errorCount > 0) {
            console.warn(`Created ${createdCount} phrases with ${errorCount} errors`);
        }

        console.log(`Initial data loaded: ${categories.length} categories, ${createdCount} phrases`);
        return {
            message: 'Initial data loaded successfully',
            categoriesCreated: categories.length,
            phrasesCreated: createdCount
        };
    } catch (error) {
        console.error('Error in loadInitialData:', error);
        throw error;
    }
}

module.exports = {
    getInitialData,
    loadInitialData
};