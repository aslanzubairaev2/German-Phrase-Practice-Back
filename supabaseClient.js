const { createClient } = require('@supabase/supabase-js');

// Получаем URL и ключ из переменных окружения
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Проверка на наличие ключей
if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or Service Key is missing. Make sure to set them in your .env file.");
    // В реальном приложении здесь можно остановить запуск сервера
}

// Создаем и экспортируем клиент Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;