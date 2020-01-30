"use strict";

class TodoAddView {
  constructor() {
    this.button = document.querySelector('button.add-items');
    this.todoTextInput = document.querySelector('input[type="text"]');
    this.updateListeners();
  }

  updateListeners() {
    this.button.onclick = () => {
      this.todoText && this.onTodoAdd && this.onTodoAdd(this.todoText);
      return false; // prevent form submit
    };
    this.todoTextInput.addEventListener("keyup", (event) =>{
      if (event.key === "Enter") {
        this.todoText && this.onTodoAdd && this.onTodoAdd(this.todoText);
      }
    });
  }

  get todoText() {
    return this.todoTextInput.value.trim();
  }

  set todoText(value) {
    this.todoTextInput.value = value;
  }

  focus() {
    this.todoTextInput.focus();
  }
}

export default TodoAddView;