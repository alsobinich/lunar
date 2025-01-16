# Используем базовый образ PHP с Apache
FROM php:8.0-apache

# Копируем файлы проекта в директорию сервера
COPY . /var/www/html

# Настраиваем права доступа
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Указываем порт
EXPOSE 80

# Запускаем Apache
CMD ["apache2-foreground"]