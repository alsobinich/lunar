<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из POST-запроса
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Проверяем, что JSON корректный
    if (json_last_error() === JSON_ERROR_NONE) {
        // Сохраняем данные в data.json
        file_put_contents('data.json', json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['message' => 'Data saved successfully']);
    } else {
        http_response_code(400); // Ошибка клиента
        echo json_encode(['message' => 'Invalid JSON data']);
    }
} else {
    http_response_code(405); // Метод не поддерживается
    echo json_encode(['message' => 'Method not allowed']);
}