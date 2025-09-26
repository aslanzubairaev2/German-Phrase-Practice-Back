const express = require('express');
const router = express.Router();
const { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } = require('../controllers/categoriesController');
const { validateCategory, validateCategoryUpdate, validateCategoryDelete } = require('../middleware/validation');
const { strictLimiter } = require('../middleware/rateLimit');

// POST /api/categories - создание категории (строгое ограничение)
router.post('/', strictLimiter, validateCategory, createCategoryHandler);

// PUT /api/categories/:id - обновление категории (строгое ограничение)
router.put('/:id', strictLimiter, validateCategoryUpdate, updateCategoryHandler);

// DELETE /api/categories/:id - удаление категории (строгое ограничение)
router.delete('/:id', strictLimiter, validateCategoryDelete, deleteCategoryHandler);

module.exports = router;