<?php
$jsonFile = '/tmp/data.json';

// Читаем входные данные
$inputData = file_get_contents('php://input');
if ($inputData) {
    // Преобразуем данные из JSON в массив
    $decodedData = json_decode($inputData, true);

    // Сохраняем данные локально в /tmp
    file_put_contents($jsonFile, json_encode($decodedData, JSON_PRETTY_PRINT));

    // Путь к репозиторию на сервере Render
    $repoPath = '/var/www/html/'; // Укажите точный путь к вашему проекту на сервере Render

    // Команды для Git
    $commands = [
        "cd $repoPath",
        "git config --global user.email 'your-email@example.com'", // Укажите ваш email
        "git config --global user.name 'Your Name'", // Укажите ваше имя
        "git pull origin main",
        "cp $jsonFile $repoPath/data.json", // Копируем обновлённый data.json в репозиторий
        "git add data.json",
        "git commit -m 'Update data.json from server'",
        "git push https://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@github.com/alsobinich/lunar.git main"
    ];

    // Выполняем команды
    foreach ($commands as $command) {
        shell_exec($command);
    }

    echo json_encode(['message' => 'Data saved and pushed to GitHub successfully']);
} else {
    echo json_encode(['error' => 'No input data provided']);
}
?>
