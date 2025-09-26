const express = require('express');
const router = express.Router();
const { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } = require('../controllers/categoriesController');
const { validateCategory } = require('../middleware/validation');

router.post('/', validateCategory, createCategoryHandler);
router.put('/:id', validateCategory, updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

module.exports = router;