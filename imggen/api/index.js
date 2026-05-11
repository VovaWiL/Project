const axios = require('axios');

module.exports = async (req, res) => {
    // Устанавливаем заголовки для работы с JSON
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Допустим только метод POST' });
    }

    try {
        const { prompt } = req.body;
        
        // Ключ берется из переменных окружения Vercel
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ 
                error: 'API_KEY_MISSING', 
                details: 'Добавьте GOOGLE_API_KEY в настройках Vercel (Environment Variables).' 
            });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
            {
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1 }
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Ошибка бэкенда:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Ошибка генерации изображения', 
            details: error.response?.data?.error?.message || error.message 
        });
    }
};
