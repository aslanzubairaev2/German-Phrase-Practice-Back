// Простое ограничение скорости запросов
const rateLimitStore = new Map();

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 минут
  const maxRequests = 100; // Максимум 100 запросов за окно

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { requests: [], blocked: false });
  }

  const userData = rateLimitStore.get(ip);

  // Очистить старые запросы
  userData.requests = userData.requests.filter(time => now - time < windowMs);

  if (userData.requests.length >= maxRequests) {
    userData.blocked = true;
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }

  userData.requests.push(now);
  next();
};

module.exports = rateLimit;