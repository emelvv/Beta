const express = require("express");
const bodyParser = require("body-parser");
const handlebars = require('express-handlebars');
const path = require("path");
const session = require('express-session');
const data = require("./data");
const app = express();
const port = 3000;

app.use(bodyParser.text());
app.use(session({
    secret: 'sosa', // Секретный ключ для подписи сессии
    resave: false, // Не сохранять сессию, если она не была изменена
    saveUninitialized: true // Сохранять сессию, даже если она не была изменена
}));
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

function isLogined(req) {return Boolean(req.session.username)}


app.get("/", (req, res) => {
    if (isLogined(req)) {
        res.render("menu", {title: "Beta | Меню", username: req.session.username})
    }else{
        res.render("auth", {title: "Beta | Вход"})
    }
});

app.post("/login", (req, res) => {
    const { login, password } = req.body;

    data.checkUser(login, password, (row) => {
        if (row) {
            req.session.username = login;
            res.sendStatus(200); // Логин и пароль найдены
        } else {
            res.sendStatus(401); // Логин и/или пароль неверные
        }
    });
});

app.get('/map', (req, res) => {
    if (isLogined(req)) {

        data.getAllUserCoord(req.session.username, (rows) => {
            if (rows) {
                res.render("map", {title: "Beta | Карта", username: req.session.username, coords: JSON.stringify(rows)})
            }     
        });
    }else{
        res.render("auth", {title: "Beta | Вход"})
    }
})

// ДОДЕЛАТЬ ВХОД ПО ПАРАМЕТРАМ ЛОГИН ПАРОЛЬ
app.post('/map', (req, res) => {
    const currentDate = new Date();
    const [ x, y ] = JSON.parse(req.body)
    console.log(`New coordinates recieved: ${x}, ${y} at ${currentDate.getHours()}:${currentDate.getMinutes()} ${currentDate.getDay()}.${currentDate.getMonth()}.${currentDate.getFullYear()}`)
    res.sendStatus(200)
})

app.get('/logout', (req, res) => {
    // Удаление сеанса пользователя
    req.session.destroy((err) => {
        if(err) {
            console.error(err);
            res.send('Ошибка при завершении сеанса');
        } else {
            res.redirect("/")
        }
    });
});



app.listen(port, () => {
    console.log(`Port: ${port}`);
});
