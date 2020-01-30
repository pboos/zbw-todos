"use strict";

import * as api from './modules/api.js';
import TodoListView from './modules/TodoListView.js';
import TodoAddView from './modules/TodoAddView.js';

// IIFE
(function () {
  const todoListView = new TodoListView();
  todoListView.onTodoDoneChange = async (todoId, done) => {
    todoListView.toggleTodoDone(todoId);
    await api.setTodoDone(todoId, done);
  };
  todoListView.onTodoRemove = async (todoId) => {
    todoListView.removeTodo(todoId);
    await api.deleteTodo(todoId);
  };

  const todoAddView = new TodoAddView();
  todoAddView.onTodoAdd = async (todoText) => {
    todoAddView.todoText = '';
    todoAddView.focus();

    const todo = await api.addTodo(todoText);
    // TODO add with random -id -1234 and then update that to the correct id?
    todoListView.addTodo(todo);
  };
  todoAddView.focus();
})();