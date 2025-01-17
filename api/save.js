import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'data.json');

    if (req.method === 'POST') {
        const newData = req.body;

        try {
            fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
            res.status(200).json({ message: 'JSON обновлён!' });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при сохранении файла.' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается.' });
    }
}
