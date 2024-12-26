# Beta
Сайт для тестов
### Установка
1. Загрузка всех зависимостей: ```npm install```
2. Создать файл users.db со схемами:
<pre>CREATE TABLE `coordinates` (`id` INTEGER, `x` REAL, `y` REAL, `date` TEXT)</pre>
<pre>CREATE TABLE "users" ( `id` INTEGER,`login` TEXT, `password` TEXT)</pre>
3. Запустить сервер: ```node server.js```
