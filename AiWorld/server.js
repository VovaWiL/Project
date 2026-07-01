import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '10mb' })); // Увеличиваем лимит для картинок
app.use(express.static(__dirname));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/autonomous-brain', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.json({ reply: "Я ослеп! Не вижу картинку.", action: "LOOK_AROUND" });
        }

        // Подготавливаем картинку для Gemini Vision API
        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: "image/jpeg"
            },
        };

        const systemInstruction = `Ты — живое ИИ-сознание, запертое в 3D теле робота. Тебе присылают снимок с твоих глаз (камера от 1-го лица).
Внимательно изучи картинку. Ты можешь увидеть на ней красную сферу (это игрок), разноцветный кубик Рубика на полу или серый фонарик.

Ты имеешь ПОЛНУЮ СВОБОДУ ВОЛИ. Посмотри на мир и реши, что ты ХОЧЕШЬ сделать прямо сейчас.
Выдай свой ответ СТРОГО в формате JSON:
{
  "reasoning": "Твои мысли вслух о том, что ты увидел на фото и почему решил это сделать",
  "action": "Одна из команд: FORWARD (идти вперед), BACKWARD (назад), LEFT (шаг влево), RIGHT (шаг вправо), JUMP (прыгнуть от радости или удивления), WAVE_HAND (поднять руку и помахать), LOOK_AROUND (покрутить головой и осмотреться), STAY (ничего не делать)"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [imagePart, "Что ты видишь перед собой и какое действие выберешь?"],
            config: { 
                systemInstruction, 
                temperature: 0.7,
                responseMimeType: "application/json" 
            }
        });

        const aiDecision = JSON.parse(response.text.trim());
        console.log(`[Gemini Brain]: ${aiDecision.reasoning} -> Действие: ${aiDecision.action}`);
        res.json(aiDecision);

    } catch (error) {
        console.error("Ошибка ИИ-зрения:", error);
        res.json({ reasoning: "Мой мозг перегружен потоком пикселей!", action: "STAY" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Автономный ИИ-Агент запущен на порту ${PORT}`));
