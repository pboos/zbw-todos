"use strict";

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const database = require('./database.js');

const app = express();
const port = process.env.NODE_PORT || 8000;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'encryptionSecretForCookie',
  resave: false,
  saveUninitialized: true,
}));

const requireAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};
// app.use(requireAuth);
// app.use((req, res, next) => setTimeout(next, 1000)); // slowdown

app.get('/api/todos', requireAuth, async (req, res) => {
  const todos = await database.getTodos();
  res.json(todos);
});
app.post('/api/todos', requireAuth, async (req, res) => {
  const id = await database.addTodo(req.body.todo);
  res.json({ id, todo: req.body.todo, done: false });
});
app.delete('/api/todos/:id', requireAuth, (req, res) => {
  database.deleteTodo(req.params.id);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});
app.post('/api/todos/:id/done', requireAuth, async (req, res) => {
  database.setTodoDone(req.params.id, true);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});
app.delete('/api/todos/:id/done', requireAuth, async (req, res) => {
  database.setTodoDone(req.params.id, false);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});

app.post('/api/users', requireAuth, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const id = await database.addUser(username, password);
  res.json({ id, username });
});
app.delete('/api/users/:id', requireAuth, async (req, res) => {
  if (parseInt(req.params.id) === req.session.user.id) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  database.deleteUser(req.params.id);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});

app.get('/', requireAuth, async (req, res) => {
  const todos = await database.getTodos();
  res.render('index', { title: 'TODOs', todos: todos });
});
app.get('/users', requireAuth, async (req, res) => {
  const users = await database.getUsers();
  res.render('users', { users });
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', (req, res) => {
  database.getLogin(req.body.username, req.body.password)
    .then((user) => {
      req.session.user = user;
      res.redirect('/');
    })
    .catch(() => {
      res.render('login', { error: 'Password wrong' });
    });
});
app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login');
});

// ONLY FOR SYNC
app.get('/update', requireAuth, async (req, res) => {
  switch (req.query['action']) {
    case 'add':
      await database.addTodo(req.query['todo']);
      break;
    case 'done':
      await database.setTodoDone(req.query['id'], req.query['done'] === 'true');
      break;
    case 'delete':
      await database.deleteTodo(req.query['id']);
      break;
  }
  res.redirect('/');
});

app.listen(port, () => console.log(`App running on: http://localhost:${port}`));