// Middleware для валидации данных
const validatePhrase = (req, res, next) => {
  const { russian, german, category_id } = req.body;

  if (!russian || typeof russian !== 'string' || russian.trim().length === 0) {
    const error = new Error('Russian text is required and must be a non-empty string');
    error.status = 400;
    error.isValidationError = true;
    return next(error);
  }

  if (!german || typeof german !== 'string' || german.trim().length === 0) {
    const error = new Error('German text is required and must be a non-empty string');
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
  const { name, color } = req.body;

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

  next();
};

module.exports = {
  validatePhrase,
  validateCategory
};