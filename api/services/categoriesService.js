const supabase = require('../../supabaseClient');

async function getAllCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');
    if (error) throw error;
    return data;
}

async function createCategory({ name, color, is_foundational }) {
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, color, is_foundational }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function updateCategory(id, { name, color }) {
    const { data, error } = await supabase
        .from('categories')
        .update({ name, color })
        .eq('id', id)
        .select();
    if (error) throw error;
    if (data.length === 0) {
        const notFoundError = new Error('Category not found');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return data[0];
}

async function deleteCategory(id, migrationTargetId) {
    try {
        // Если есть фразы для миграции, обновляем их
        if (migrationTargetId) {
            const { error: updateError } = await supabase
                .from('phrases')
                .update({ category_id: migrationTargetId })
                .eq('category_id', id);
            if (updateError) throw updateError;
        } else {
            // Иначе (или если миграция не нужна), удаляем связанные фразы
            const { error: deletePhrasesError } = await supabase
                .from('phrases')
                .delete()
                .eq('category_id', id);
            if (deletePhrasesError) throw deletePhrasesError;
        }

        // Удаляем саму категорию
        const { error: deleteCategoryError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (deleteCategoryError) throw deleteCategoryError;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};