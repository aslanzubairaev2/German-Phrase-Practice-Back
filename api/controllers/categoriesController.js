const { createCategory, updateCategory, deleteCategory } = require('../services/categoriesService');

async function createCategoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const categoryData = {
            name: req.body.name,
            color: req.body.color,
            is_foundational: req.body.is_foundational !== undefined ? req.body.is_foundational : false
        };
        const data = await createCategory(userId, categoryData);
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category', details: error.message });
    }
}

async function updateCategoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const data = await updateCategory(userId, req.params.id, req.body);
        res.json(data);
    } catch (error) {
        console.error(`Error updating category ${req.params.id}:`, error);
        const status = error.status || 500;
        res.status(status).json({ error: 'Failed to update category', details: error.message });
    }
}

async function deleteCategoryHandler(req, res) {
    try {
        const userId = req.user.id;
        await deleteCategory(userId, req.params.id, req.body.migrationTargetId);
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting category ${req.params.id}:`, error);
        res.status(500).json({ error: 'Failed to delete category', details: error.message });
    }
}

module.exports = {
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler
};