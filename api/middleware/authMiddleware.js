const supabase = require('../../supabaseClient');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Верифицируем токен с помощью Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user || !user.id) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Добавляем user в req для использования в контроллерах
        req.user = user;

        if (!user.id || user.id === 'undefined') {
            return res.status(401).json({ error: 'Invalid user' });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;