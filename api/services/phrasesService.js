const supabase = require('../../supabaseClient');

async function getAllPhrases() {
    const { data, error } = await supabase
        .from('phrases')
        .select('*');
    if (error) throw error;
    return data;
}

async function createPhrase({ russian, german, category_id }) {
    const { data, error } = await supabase
        .from('phrases')
        .insert([{ russian, german, category_id }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function updatePhrase(id, { russian, german, category_id }) {
    const { data, error } = await supabase
        .from('phrases')
        .update({ russian, german, category_id })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
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