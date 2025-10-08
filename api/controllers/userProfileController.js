const { getUserProfile, updateUserProfile, upsertUserProfile } = require('../services/userProfileService');

async function getUserProfileHandler(req, res) {
    try {
        const userId = req.user.id;
        const supabaseClient = req.supabaseClient;
        const profile = await getUserProfile(supabaseClient, userId);
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile', details: error.message });
    }
}

async function updateUserProfileHandler(req, res) {
    try {
        const userId = req.user.id;
        const supabaseClient = req.supabaseClient;
        const { ui_language, native_language, learning_language } = req.body;

        if (!ui_language || !native_language || !learning_language) {
            return res.status(400).json({ error: 'Missing required fields: ui_language, native_language, learning_language' });
        }

        const updated = await updateUserProfile(
            supabaseClient,
            userId,
            { ui_language, native_language, learning_language }
        );

        res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile', details: error.message });
    }
}

async function upsertUserProfileHandler(req, res) {
    try {
        const userId = req.user.id;
        const supabaseClient = req.supabaseClient;
        const { ui_language, native_language, learning_language } = req.body;

        if (!ui_language || !native_language || !learning_language) {
            return res.status(400).json({ error: 'Missing required fields: ui_language, native_language, learning_language' });
        }

        const profile = await upsertUserProfile(
            supabaseClient,
            userId,
            { ui_language, native_language, learning_language }
        );

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error upserting user profile:', error);
        res.status(500).json({ error: 'Failed to save user profile', details: error.message });
    }
}

module.exports = {
    getUserProfileHandler,
    updateUserProfileHandler,
    upsertUserProfileHandler
};
