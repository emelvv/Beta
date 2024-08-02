const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database('users.db');
const coord = new sqlite3.Database('coord.db');

function checkUser(login, password, callback) {
    users.get('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

function getAllCoord(callback) {
    coord.all('SELECT * FROM coordinates', [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            let coords = []
            for (let i=0;i<rows.length;i++){
                coords.push([parseFloat(rows[i].x), parseFloat(rows[i].y)])
            }
            callback(null, coords);
        }
    });
}



module.exports = { checkUser, getAllCoord };
