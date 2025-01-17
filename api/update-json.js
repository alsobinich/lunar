import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается. Используйте POST.' });
  }

  const { newContent } = req.body;

  if (!newContent) {
    return res.status(400).json({ error: 'Нет данных для обновления.' });
  }

  const token = process.env.GITHUB_TOKEN;
  const repoOwner = 'alsobinich';
  const repoName = 'lunar';
  const filePath = 'data.json';
  const branch = 'main';

  try {
    // Получаем SHA текущего файла
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
    const sha = fileData.sha;

    // Обновляем содержимое файла
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Обновление data.json через API',
          content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
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
