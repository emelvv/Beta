const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database('users.db');
const coord = new sqlite3.Database('coord.db');

function checkUser(login, password, callback) {
    users.get('SELECT * FROM users WHERE login = ? AND password = ?', [login, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        callback(row);
    });
}


function getAllUserCoord(login, callback) {
    users.get("SELECT id FROM users WHERE login = ?", [login], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        users.all("SELECT x, y FROM coordinates WHERE id = ?", [row.id], (err, rows) => {
            let coords = []
            for (let i=0;i<rows.length;i++){
                coords.push([parseFloat(rows[i].x), parseFloat(rows[i].y)])
            }
            callback(coords)
        })
    })
}


module.exports = { checkUser, getAllUserCoord };
