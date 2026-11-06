import { todoKeys, ANIMATION_MS } from "./constants.js";
import { createTodo, completeTodoById, deleteTodoById } from "./service.js";
import { setTodosToLocalStorage } from "./storage.js";

const formElement = document.querySelector(".form");
const inputElement = document.querySelector(".input");
const todosElement = document.querySelector(".todos");

const createButton = (className, symbol, label) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${className} button`;
  button.textContent = symbol;
  button.setAttribute("aria-label", label);
  return button;
};

// Весь пользовательский текст попадает в DOM только через textContent,
// поэтому HTML в тексте задачи не исполняется (защита от XSS).
const createTodoElement = (todo) => {
  const todoElement = document.createElement("li");
  todoElement.className = "todo";
  todoElement.dataset.id = String(todo[todoKeys.id]);

  const textElement = document.createElement("div");
  textElement.className = "todo-text";
  textElement.textContent = todo[todoKeys.text];

  const actionsElement = document.createElement("div");
  actionsElement.className = "todo-actions";
  actionsElement.append(
    createButton("button-complete", "\u2714", "Отметить выполненной"),
    createButton("button-delete", "\u2716", "Удалить задачу"),
  );

  todoElement.append(textElement, actionsElement);
  return todoElement;
};

export const renderTodos = (todos) => {
  todosElement.replaceChildren();
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    if (todo[todoKeys.is_completed]) {
      todoElement.classList.add("completed");
    }
    todosElement.prepend(todoElement);
  });
};

const handleCreateTodo = (todos, text) => {
  const todo = createTodo(todos, text);
  if (!todo) return false;

  const todoElement = createTodoElement(todo);
  todoElement.classList.add("entering");
  todoElement.addEventListener(
    "animationend",
    () => todoElement.classList.remove("entering"),
    { once: true },
  );

  setTodosToLocalStorage(todos);
  todosElement.prepend(todoElement);
  return true;
};

const removeTodoElement = (todoElement) => {
  if (todoElement.classList.contains("removing")) return;
  todoElement.classList.add("removing");

  let isRemoved = false;
  const finish = () => {
    if (isRemoved) return;
    isRemoved = true;
    todoElement.remove();
  };

  todoElement.addEventListener("animationend", (event) => {
    if (event.target === todoElement) finish();
  });
  // запасной вариант, если animationend не сработает
  setTimeout(finish, ANIMATION_MS + 100);
};

export const initTodoHandlers = (todos) => {
  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = inputElement.value.trim();
    if (!text) return;

    if (handleCreateTodo(todos, text)) {
      inputElement.value = "";
    }
  });

  todosElement.addEventListener("click", ({ target }) => {
    const button = target.closest("button");
    if (!button) return;

    const todoElement = button.closest(".todo");
    if (!todoElement || todoElement.classList.contains("removing")) return;

    const todoId = Number(todoElement.dataset.id);

    if (button.classList.contains("button-complete")) {
      const todo = completeTodoById(todos, todoId);
      if (!todo) return;
      setTodosToLocalStorage(todos);
      todoElement.classList.toggle("completed", todo[todoKeys.is_completed]);
    }

    if (button.classList.contains("button-delete")) {
      if (!deleteTodoById(todos, todoId)) return;
      setTodosToLocalStorage(todos);
      removeTodoElement(todoElement);
    }
  });
};
