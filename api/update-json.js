import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается. Используйте POST.' });
  }

  const { newContent } = req.body;

  if (!newContent) {
    return res.status(400).json({ error: 'Нет данных для обновления.' });
  }

  const token = process.env.GITHUB_TOKEN; // Получаем токен из переменных окружения
  const repoOwner = 'alsobinich'; // Ваш логин на GitHub
  const repoName = 'lunar'; // Название репозитория
  const filePath = 'data.json'; // Файл, который вы хотите обновлять
  const branch = 'main'; // Ветка, в которой находится файл

  try {
    // Шаг 1: Получаем SHA текущего файла
    const fileResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Не удалось получить файл: ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();
    const sha = fileData.sha; // Текущий SHA файла

    // Шаг 2: Обновляем содержимое файла
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Обновление data.json через API', // Комментарий к коммиту
          content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'), // Новое содержимое файла
          sha: sha,
          branch: branch,
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Не удалось обновить файл: ${updateResponse.statusText}`);
    }

    res.status(200).json({ message: 'data.json обновлён успешно!' });
  } catch (error) {
    console.error('Ошибка при обновлении файла:', error);
    res.status(500).json({ error: 'Ошибка при обновлении файла.' });
  }
}
