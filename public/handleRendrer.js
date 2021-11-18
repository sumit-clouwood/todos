const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
const { boolean } = require('webidl-conversions');

function initDb() {
  const db = new sqlite3.Database('todos.db');
  ipcMain.on('sqliteOperations', (event, arg) => {
    console.log('---------------sqliteOperations-----------------');
    console.log(arg);
    const { type, data } = arg;
    if (type === 'CREATE' || type === 'INSERT') {
      try {
        db.run(...data);
        event.sender.send('sqliteOperationsResp', 'success');
      } catch (error) {
        console.error(error);
        event.sender.send('sqliteOperationsResp', error.message);
      }
    } else {
      const rows = [];
      db.each(data, function (err, row) {
        if (err) event.sender.send('sqliteOperationsResp', err);
        console.log(row);
        if (row) {
          row.isCompleted = boolean(row.isCompleted);
          rows.push(row);
        }
      });
      setTimeout(() => {
        event.sender.send('todos', rows);
      }, 1000);
    }
  });
}

module.exports = initDb;
