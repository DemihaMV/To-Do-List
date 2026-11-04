import { getTodosFromLocalStorage } from "./storage.js";
import { renderTodos, initTodoHandlers } from "./dom.js";

const todos = getTodosFromLocalStorage();

renderTodos(todos);
initTodoHandlers(todos);