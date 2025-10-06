const { createClient } = require('@supabase/supabase-js');
const supabase = require('../../supabaseClient');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            console.log('❌ Auth: No token provided');
            return res.status(401).json({ error: 'No token provided' });
        }

        // Верифицируем токен с помощью Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user || !user.id) {
            console.log('❌ Auth: Invalid token', error);
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Добавляем user в req для использования в контроллерах
        req.user = user;

        if (!user.id || user.id === 'undefined') {
            console.log('❌ Auth: Invalid user.id');
            return res.status(401).json({ error: 'Invalid user' });
        }

        // КРИТИЧНО: Создать Supabase клиент с токеном пользователя
        // Это устанавливает правильный контекст для RLS политик
        req.supabaseClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        console.log('✅ Auth: User authenticated:', user.id, user.email);
        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

module.exports = authMiddleware;