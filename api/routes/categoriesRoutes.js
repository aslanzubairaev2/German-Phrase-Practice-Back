const express = require('express');
const router = express.Router();
const { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } = require('../controllers/categoriesController');
const { validateCategory, validateDeleteCategory } = require('../middleware/validation');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

router.post('/', validateCategory, createCategoryHandler);
router.put('/:id', validateCategory, updateCategoryHandler);
router.delete('/:id', validateDeleteCategory, deleteCategoryHandler);

module.exports = router;