const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database('users.db');

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
        users.all("SELECT x, y, date FROM coordinates WHERE id = ?", [row.id], (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }
            let coords = []
            for (let i=0;i<rows.length;i++){
                coords.push([parseFloat(rows[i].x), parseFloat(rows[i].y), rows[i].date])
            }
            callback(coords)
        })
    })
}

function addNewUserCoord(login, x, y, date) {
    users.get("SELECT id FROM users WHERE login = ?", [login], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        users.run("INSERT INTO coordinates (id, x, y, date) VALUES (?, ?, ?, ?)", [row.id, x, y, date], (err)=>{
            if (err) {
                console.error(err.message);
                return;
            }
        })
    })
}

function deleteByDateCoord(date) {
    users.run("DELETE FROM coordinates WHERE date = ?", [date], (err)=>{
        if (err) {
            console.error(err.message);
            return;
        }
    })
}

module.exports = { checkUser, getAllUserCoord, addNewUserCoord, deleteByDateCoord};
