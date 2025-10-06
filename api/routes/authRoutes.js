const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Все маршруты аутентификации требуют токена
router.use(authMiddleware);

// Получить профиль пользователя
router.get('/profile', authController.getProfile);

// Верифицировать токен
router.get('/verify', authController.verifyToken);

module.exports = router;