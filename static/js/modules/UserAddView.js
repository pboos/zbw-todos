"use strict";

class UserAddView {
  constructor() {
    this.button = document.querySelector('button.btn-primary');
    this.usernameInput = document.querySelector('input[name="username"]');
    this.passwordInput = document.querySelector('input[name="password"]');
    this.updateListeners();
  }

  updateListeners() {
    const onUserAdd = () => this.username && this.password && this.onUserAdd && this.onUserAdd(this.username, this.password);

    this.button.onclick = () => {
      onUserAdd();
      return false; // prevent form submit
    };
    this.passwordInput.addEventListener("keyup", (event) =>{
      if (event.key === "Enter") {
        onUserAdd();
      }
    });
  }

  get username() {
    return this.usernameInput.value.trim();
  }

  set username(value) {
    this.usernameInput.value = value;
  }

  get password() {
    return this.passwordInput.value.trim();
  }

  set password(value) {
    this.passwordInput.value = value;
  }

  focus() {
    this.usernameInput.focus();
  }
}

export default UserAddView;