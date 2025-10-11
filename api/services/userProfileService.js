async function getUserProfile(supabaseClient, userId) {
    const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code === 'PGRST116') {
        // No profile found - return null instead of creating default
        // Let the frontend handle onboarding
        return null;
    }

    if (error) throw error;
    return data;
}

async function createDefaultProfile(supabaseClient, userId) {
    // Detect browser language would happen on frontend
    // Default to English for new users
    const { data, error } = await supabaseClient
        .from('user_profiles')
        .insert([{
            user_id: userId,
            ui_language: 'en',
            native_language: 'en',
            learning_language: 'de',
            schema_version: 1
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

async function updateUserProfile(supabaseClient, userId, { ui_language, native_language, learning_language }) {
    const payload = {
        ui_language,
        native_language,
        learning_language,
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseClient
        .from('user_profiles')
        .update(payload)
        .eq('user_id', userId)
        .select()
        .maybeSingle();

    if (error) {
        if (error.code === 'PGRST116') {
            return upsertUserProfile(supabaseClient, userId, { ui_language, native_language, learning_language });
        }
        throw error;
    }

    if (!data) {
        // No existing profile for this user yet - create one instead of failing.
        return upsertUserProfile(supabaseClient, userId, { ui_language, native_language, learning_language });
    }

    return data;
}

async function upsertUserProfile(supabaseClient, userId, { ui_language, native_language, learning_language }) {
    const { data, error} = await supabaseClient
        .from('user_profiles')
        .upsert({
            user_id: userId,
            ui_language,
            native_language,
            learning_language,
            schema_version: 1,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

module.exports = {
    getUserProfile,
    createDefaultProfile,
    updateUserProfile,
    upsertUserProfile
};
