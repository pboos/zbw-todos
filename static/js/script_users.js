"use strict";

import * as api from './modules/api.js';
import UserListView from './modules/UserListView.js';
import UserAddView from './modules/UserAddView.js';

// IIFE
(function () {
  const userListView = new UserListView();
  userListView.onUserRemove = async (userId) => {
    userListView.removeUser(userId);
    await api.deleteUser(userId);
  };

  const userAddView = new UserAddView();
  userAddView.onUserAdd = async (username, password) => {
    userAddView.username = '';
    userAddView.password = '';
    userAddView.focus();

    const user = await api.addUser(username, password);
    // TODO add with random -id -1234 and then update that to the correct id?
    userListView.addUser(user);
  };
  userAddView.focus();
})();