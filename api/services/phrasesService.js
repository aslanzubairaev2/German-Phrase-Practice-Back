async function getAllPhrases(supabaseClient, userId) {
    const { data, error } = await supabaseClient
        .from('phrases')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

async function createPhrase(supabaseClient, userId, { native_text, learning_text, category_id, transcription, context }) {
    const { data, error } = await supabaseClient
        .from('phrases')
        .insert([{ user_id: userId, native_text, learning_text, category_id, transcription, context }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function updatePhrase(supabaseClient, userId, id, { native_text, learning_text, category_id, transcription, context, masteryLevel, lastReviewedAt, nextReviewAt, knowCount, knowStreak, isMastered, lapses }) {
    const { data, error } = await supabaseClient
        .from('phrases')
        .update({ native_text, learning_text, category_id, transcription, context, masteryLevel, lastReviewedAt, nextReviewAt, knowCount, knowStreak, isMastered, lapses })
        .eq('id', id)
        .eq('user_id', userId)
        .select();
    if (error) throw error;
    if (data.length === 0) {
        const notFoundError = new Error('Phrase not found');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return data[0];
}

async function deletePhrase(supabaseClient, userId, id) {
    const { error } = await supabaseClient
        .from('phrases')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    if (error) throw error;
}

module.exports = {
    getAllPhrases,
    createPhrase,
    updatePhrase,
    deletePhrase
};