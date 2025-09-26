const supabase = require('../../supabaseClient');

async function getAllPhrases() {
    const { data, error } = await supabase
        .from('phrases')
        .select('*');
    if (error) throw error;
    return data;
}

async function createPhrase({ russian, german, category_id, transcription, context }) {
    const { data, error } = await supabase
        .from('phrases')
        .insert([{ russian, german, category_id, transcription, context }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function updatePhrase(id, { russian, german, category_id, transcription, context, masteryLevel, lastReviewedAt, nextReviewAt, knowCount, knowStreak, isMastered, lapses }) {
    const { data, error } = await supabase
        .from('phrases')
        .update({ russian, german, category_id, transcription, context, masteryLevel, lastReviewedAt, nextReviewAt, knowCount, knowStreak, isMastered, lapses })
        .eq('id', id)
        .select();
    if (error) throw error;
    if (data.length === 0) {
        const notFoundError = new Error('Phrase not found');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return data[0];
}

async function deletePhrase(id) {
    const { error } = await supabase
        .from('phrases')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

module.exports = {
    getAllPhrases,
    createPhrase,
    updatePhrase,
    deletePhrase
};