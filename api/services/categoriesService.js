const supabase = require('../../supabaseClient');

async function getAllCategories(userId) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

async function createCategory(userId, { name, color, is_foundational }) {
    // Check if category with this name already exists for the user
    const { data: existing, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .eq('name', name)
        .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw checkError;
    }

    if (existing) {
        const error = new Error('Category with this name already exists');
        error.status = 409; // Conflict
        throw error;
    }

    const { data, error } = await supabase
        .from('categories')
        .insert([{ user_id: userId, name, color, is_foundational }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function updateCategory(userId, id, { name, color }) {
    const { data, error } = await supabase
        .from('categories')
        .update({ name, color })
        .eq('id', id)
        .eq('user_id', userId)
        .select();
    if (error) throw error;
    if (data.length === 0) {
        const notFoundError = new Error('Category not found');
        notFoundError.status = 404;
        throw notFoundError;
    }
    return data[0];
}

async function deleteCategory(userId, id, migrationTargetId) {
    try {
        // Если есть фразы для миграции, обновляем их
        if (migrationTargetId) {
            const { error: updateError } = await supabase
                .from('phrases')
                .update({ category_id: migrationTargetId })
                .eq('category_id', id)
                .eq('user_id', userId);
            if (updateError) throw updateError;
        } else {
            // Иначе (или если миграция не нужна), удаляем связанные фразы
            const { error: deletePhrasesError } = await supabase
                .from('phrases')
                .delete()
                .eq('category_id', id)
                .eq('user_id', userId);
            if (deletePhrasesError) throw deletePhrasesError;
        }

        // Удаляем саму категорию
        const { error: deleteCategoryError } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
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