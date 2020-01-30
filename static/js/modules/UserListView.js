"use strict";

import {escapeHtml} from './escapeHtml.js';

class UserListView {
  constructor() {
    this.updateListeners();
  }

  updateListeners() {
    const userElements = document.querySelectorAll('#users .user');
    Array.prototype.forEach.call(userElements, (userElement) => {
      const id = this.getUserIdOfElement(userElement);

      this.getUserDeleteButton(id).onclick = async (event) => {
        setTimeout(() => this.onUserRemove && this.onUserRemove(id), 0);
        event.preventDefault();
      };
    });
  }

  addUser(user) {
    const element = document.createElement('li');
    element.id = `user-${user.id}`;
    element.classList.add('user');
    element.classList.add('d-flex');
    element.classList.add('align-items-center');
    
    element.innerHTML = `<span class="flex-grow-1">${escapeHtml(user.username)}</span><a class="remove text-right" href="#"><i class="fa fa-trash"></i></a>`;
    document.getElementById('users').appendChild(element);

    this.updateListeners(); // to add listener for added one
  }

  removeUser(id) {
    const element = this.getUserElement(id);
    if (element) {
      element.remove();
    }
  }

  getUserIdOfElement(element) {
    if (!element) return null;
    if (element.id.startsWith('user-')) {
      return element.id.substr(element.id.indexOf('-') + 1);
    }
    return this.getUserIdOfElement(element.parentElement);
  }

  getUserElement(id) {
    return document.getElementById(`user-${id}`);
  }

  getUserDeleteButton(id) {
    const element = this.getUserElement(id);
    if (!element) return null;
    return element.querySelector('a.remove');
  }
}

export default UserListView;