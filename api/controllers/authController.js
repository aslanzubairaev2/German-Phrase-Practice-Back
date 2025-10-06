const authService = require('../services/authService');

class AuthController {
    // Получить профиль пользователя
    async getProfile(req, res) {
        try {
            const user = req.user; // Из middleware
            const profile = await authService.getUserProfile(user.id);
            res.json({
                id: profile.id,
                email: profile.email,
                created_at: profile.created_at
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Failed to get profile', details: error.message });
        }
    }

    // Верифицировать токен (для тестов)
    async verifyToken(req, res) {
        try {
            const user = req.user;
            res.json({ valid: true, user: { id: user.id, email: user.email } });
        } catch (error) {
            console.error('Verify token error:', error);
            res.status(500).json({ error: 'Token verification failed', details: error.message });
        }
    }
}

module.exports = new AuthController();