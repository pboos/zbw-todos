"use strict";

export const getTodos = async () => {
  return await fetch(`/api/todos`).then(response => response.json());
};

export const addTodo = async (todo) => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ todo: todo })
  });
  return await response.json();
};

export const setTodoDone = async (id, done = true) => {
  await fetch(`/api/todos/${id}/done`, { method: done ? 'POST' : 'DELETE' });
};

export const deleteTodo = async (id) => {
  return await fetch(`/api/todos/${id}`, { method: 'DELETE' });
};

///////////////////////////////

export const addUser = async (username, password) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
};

export const deleteUser = async (id) => {
  return await fetch(`/api/users/${id}`, { method: 'DELETE' });
};