const rateLimit = require('express-rate-limit');

// Общий rate limiter для всех API эндпоинтов
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимум 100 запросов на IP за 15 минут
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Возвращать rate limit info в headers `RateLimit-*`
  legacyHeaders: false, // Отключить `X-RateLimit-*` headers
});

// Строгий limiter для создания/обновления/удаления
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 20, // Максимум 20 запросов на IP за 15 минут
  message: {
    error: 'Too many write operations from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Легкий limiter для чтения данных
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 200, // Максимум 200 запросов на IP за 15 минут
  message: {
    error: 'Too many read requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  strictLimiter,
  readLimiter,
};