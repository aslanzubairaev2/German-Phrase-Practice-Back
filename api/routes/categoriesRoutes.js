const express = require('express');
const router = express.Router();
const { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } = require('../controllers/categoriesController');

router.post('/', createCategoryHandler);
router.put('/:id', updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

module.exports = router;