"use strict";

const sqlite3 = require('sqlite3').verbose(); // remove verbose for less output
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    this.db = new sqlite3.Database('./todos.db'); // or :memory: for in memory only
    this.initializeDatabase();
  }

  initializeDatabase() {
    // initialize database
    this.db.serialize(() => {
      this.db.run('CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, done INTEGER);');
      this.db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);');

      // if no users yet, add admin user 'admin', 'admin'
      this.db.get('SELECT count(id) as count FROM users;', (err, row) => {
        if (err) return console.error(err);
        if (row.count === 0) {
          this.db.run(
            'INSERT INTO users (username, password) VALUES (?, ?);',
            'admin', this.hashPassword('admin'));
        }
      });
    });
  }

  getTodos() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT * FROM todos", (err, rows) => {
          if (err) return reject(err);

          resolve(rows);
        });
      });
    });
  }

  addTodo(text) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare("INSERT INTO todos (text) VALUES (?)");
        stmt.run(text, function () { // function to get the this context sqlite3 sets
          resolve(this.lastID);
        });
        stmt.finalize();
      });
    });
  }

  setTodoDone(id, done) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare("UPDATE todos SET done=? WHERE id=?");
        stmt.run(done ? 1 : 0, id);
        stmt.finalize();
        resolve();
      });
    });
  }

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare("DELETE FROM todos WHERE id=?");
        stmt.run(id);
        stmt.finalize();
        resolve();
      });
    });
  }

  //////////////////////////////////////////

  getUsers() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all("SELECT id, username FROM users", (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
    });
  }

  addUser(username, password) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, this.hashPassword(password), function (err) { // function to get the this context sqlite3 sets
          if (err) return reject(err);
          resolve(this.lastID);
        });
        stmt.finalize();
      });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const stmt = this.db.prepare("DELETE FROM users WHERE id=?");
        stmt.run(id);
        stmt.finalize();
        resolve();
      });
    });
  }

  getLogin(email, password) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE username=?;', email, (err, row) => {
        if (err
          || !row
          || !bcrypt.compareSync(password, row.password)) {
          return reject();
        }

        return resolve(row);
      });
    });
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
}

module.exports = new Database();