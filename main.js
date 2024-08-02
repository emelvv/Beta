const fetch = require('node-fetch');

// URL, на который будет отправлен POST запрос
const url = 'http://localhost:3000/map';

// Данные для отправки в формате JSON
const data = {
    key1: 'value1',
    key2: 'value2'
};

// Опции для POST запроса
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};
console.log(JSON.stringify(data))
// Отправка POST запроса
fetch(url, options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
