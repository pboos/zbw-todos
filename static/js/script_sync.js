"use strict";

import TodoListView from './modules/TodoListView.js';
import TodoAddView from './modules/TodoAddView.js';
import {updateSync} from './modules/updateSync.js';

// IIFE
(function () {
  const todoListView = new TodoListView();
  todoListView.onTodoDoneChange = async (todoId, done) => {
    updateSync('done', {id: todoId, done: done});
  };
  todoListView.onTodoRemove = async (todoId) => {
    updateSync('delete', {id: todoId});
  };

  const todoAddView = new TodoAddView();
  todoAddView.onTodoAdd = async (todoText) => {
    updateSync('add', {todo: todoText});
  };
  todoAddView.focus();
})();