const supabase = require('../../supabaseClient');

class AuthService {
    // Метод для получения профиля пользователя
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase.auth.admin.getUserById(userId);
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw new Error('Failed to get user profile');
        }
    }

    // Метод для верификации токена (если нужно отдельно)
    async verifyToken(token) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error) throw error;
            return user;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Invalid token');
        }
    }
}

module.exports = new AuthService();