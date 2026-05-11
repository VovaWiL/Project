const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Используйте POST запрос' });
    }

    try {
        const { prompt } = req.body;
        // Ключ берется из Environment Variables, которые ты настроил в Vercel
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'API ключ не найден в настройках Vercel' });
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
        res.status(500).json({ 
            error: 'Ошибка бэкенда', 
            details: error.response?.data || error.message 
        });
    }
};
