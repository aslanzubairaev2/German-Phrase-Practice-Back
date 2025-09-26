const Joi = require('joi');

// Схемы валидации
const phraseSchema = Joi.object({
  russian: Joi.string().min(1).max(500).required(),
  german: Joi.string().min(1).max(500).required(),
  category_id: Joi.number().integer().positive().required(),
});

const categorySchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().min(1).max(100).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
  is_foundational: Joi.boolean().optional(),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  is_foundational: Joi.boolean().optional(),
}).min(1); // Хотя бы одно поле должно быть

const categoryDeleteSchema = Joi.object({
  migrationTargetId: Joi.number().integer().positive().optional(),
});

// Middleware для валидации
const validatePhrase = (req, res, next) => {
  const { error } = phraseSchema.validate(req.body);
  if (error) {
    const err = new Error(`Validation error: ${error.details[0].message}`);
    err.status = 400;
    return next(err);
  }
  next();
};

const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    const err = new Error(`Validation error: ${error.details[0].message}`);
    err.status = 400;
    return next(err);
  }
  next();
};

const validateCategoryUpdate = (req, res, next) => {
  const { error } = categoryUpdateSchema.validate(req.body);
  if (error) {
    const err = new Error(`Validation error: ${error.details[0].message}`);
    err.status = 400;
    return next(err);
  }
  next();
};

const validateCategoryDelete = (req, res, next) => {
  const { error } = categoryDeleteSchema.validate(req.body);
  if (error) {
    const err = new Error(`Validation error: ${error.details[0].message}`);
    err.status = 400;
    return next(err);
  }
  next();
};

module.exports = {
  validatePhrase,
  validateCategory,
  validateCategoryUpdate,
  validateCategoryDelete,
};