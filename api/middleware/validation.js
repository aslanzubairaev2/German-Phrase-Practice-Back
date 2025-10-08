// Middleware для валидации данных
const validatePhrase = (req, res, next) => {
  const { native_text, learning_text, category_id } = req.body;

  if (!native_text || typeof native_text !== 'string' || native_text.trim().length === 0) {
    const error = new Error('Native text is required and must be a non-empty string');
    error.status = 400;
    error.isValidationError = true;
    return next(error);
  }

  if (!learning_text || typeof learning_text !== 'string' || learning_text.trim().length === 0) {
    const error = new Error('Learning text is required and must be a non-empty string');
    error.status = 400;
    error.isValidationError = true;
    return next(error);
  }

  if (!category_id || typeof category_id !== 'number') {
    const error = new Error('Category ID is required and must be a number');
    error.status = 400;
    error.isValidationError = true;
    return next(error);
  }

  next();
};

const validateCategory = (req, res, next) => {
   const { name, color, is_foundational } = req.body;

   if (!name || typeof name !== 'string' || name.trim().length === 0) {
      const error = new Error('Category name is required and must be a non-empty string');
      error.status = 400;
      error.isValidationError = true;
      return next(error);
   }

   if (!color || typeof color !== 'string' || !/^#[0-9A-F]{6}$/i.test(color)) {
      const error = new Error('Color is required and must be a valid hex color code');
      error.status = 400;
      error.isValidationError = true;
      return next(error);
   }

   if (is_foundational !== undefined && typeof is_foundational !== 'boolean') {
      const error = new Error('is_foundational must be a boolean if provided');
      error.status = 400;
      error.isValidationError = true;
      return next(error);
   }

   next();
};

const validateDeleteCategory = (req, res, next) => {
  const { migrationTargetId } = req.body;

  if (migrationTargetId !== undefined && (typeof migrationTargetId !== 'number' || migrationTargetId <= 0)) {
    const error = new Error('Migration target ID must be a positive number if provided');
    error.status = 400;
    error.isValidationError = true;
    return next(error);
  }

  next();
};

module.exports = {
  validatePhrase,
  validateCategory,
  validateDeleteCategory
};