export const todoKeys = {
  id: "id",
  text: "text",
  is_completed: "is_completed",
};

export const STORAGE_KEY = "todos";
export const MAX_TEXT_LENGTH = 200;
export const MAX_TODOS = 500;
export const ANIMATION_MS = 500;

export const errTodoNotFound = (todoId) => `Todo with id ${todoId} not found`;
