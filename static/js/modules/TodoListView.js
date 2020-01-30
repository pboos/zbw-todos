"use strict";

import {escapeHtml} from './escapeHtml.js';

class TodoListView {
  constructor() {
    this.updateListeners();
  }

  updateListeners() {
    const todoList = document.querySelectorAll('#todos .todo');
    Array.prototype.forEach.call(todoList, (todo) => {
      const id = this.getTodoIdOfElement(todo);

      this.getTodoCheckbox(id).onclick = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setTimeout(() => this.onTodoDoneChange && this.onTodoDoneChange(id, !event.target.checked), 0);
      };

      this.getTodoDeleteButton(id).onclick = async (event) => {
        setTimeout(() => this.onTodoRemove && this.onTodoRemove(id), 0);
        event.preventDefault();
      };
    });
  }

  addTodo(todo) {
    const element = document.createElement('li');
    element.id = `todo-${todo.id}`;
    element.classList.add('todo');
    element.classList.add('d-flex');
    element.classList.add('align-items-center');
    element.innerHTML = `<input class="checkbox" type="checkbox"><span class="flex-grow-1 todo-text">${escapeHtml(todo.todo)}</span><a class="remove text-right" href="#"><i class="fa fa-trash"></i></a>`;
    document.getElementById('todos').appendChild(element);

    this.updateListeners(); // to add listener for added one
  }

  toggleTodoDone(id) {
    const checkbox = this.getTodoCheckbox(id);
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      this.getTodoElement(id).classList.toggle('done');
    }
  }

  removeTodo(id) {
    const element = this.getTodoElement(id);
    if (element) {
      element.remove();
    }
  }

  getTodoIdOfElement(element) {
    if (!element) return null;
    if (element.id.startsWith('todo-')) {
      return element.id.substr(element.id.indexOf('-') + 1);
    }
    return this.getTodoIdOfElement(element.parentElement);
  }

  getTodoElement(id) {
    return document.getElementById(`todo-${id}`);
  }

  getTodoCheckbox(id) {
    const element = this.getTodoElement(id);
    if (!element) return null;
    return element.querySelector('input[type="checkbox"]');
  }

  getTodoDeleteButton(id) {
    const element = this.getTodoElement(id);
    if (!element) return null;
    return element.querySelector('a.remove');
  }
}

export default TodoListView;