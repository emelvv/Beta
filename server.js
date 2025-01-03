const express = require("express");
const vars = require('./vars.js');
const os = require('os');
const bodyParser = require("body-parser");
const handlebars = require('express-handlebars');
const path = require("path");
const moment = require('moment-timezone');
const session = require('express-session');
const data = require("./data");
const app = express();




app.use(bodyParser.json());
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
                res.render("map", {title: "Beta | Карта", api: vars.YANDEXKEY, ip: vars.IP, username: req.session.username, coords: rows, coords_str: JSON.stringify(rows)}) // кодирую потому что handlebars чёрт поганит строку
            }     
        });
    }else{
        res.render("auth", {title: "Beta | Вход"})
    }
})



app.post('/map', (req, res) => {
    const currentDate = moment().tz('Europe/Moscow').format('HH:mm:ss DD-MM-YYYY');;
    const [ x, y, login, password ] = req.body

    data.checkUser(login, password, (row) => {
        if (row) {
            console.log(`New coordinates recieved from ${login}: ${x}, ${y} at ${currentDate}`)
            data.addNewUserCoord(login, x, y, currentDate)
            res.sendStatus(200); // Логин и пароль найдены
        } else {
            res.sendStatus(401); // Логин и/или пароль неверные
        }
    });
})

app.post('/map-delete', (req, res) => {
    const [id] = req.body
    if (req.session.username) {
        data.deleteByDateCoord(id)
        res.sendStatus(200);
        return;
    }
    res.sendStatus(401);
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

async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        return data.ip;
    } catch (error) {
        console.error('Произошла ошибка:', error);
        return null;
    }
}

if (!vars.IP){
    getIPAddress()
        .then(ipAddress => {vars.IP=ipAddress})
        .catch(error => console.error('Произошла ошибка:', error));
}

app.listen(vars.PORT, () => {
    console.log(`Port: ${vars.PORT}`);
});
