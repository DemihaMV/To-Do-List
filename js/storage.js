import { todoKeys, STORAGE_KEY, MAX_TEXT_LENGTH, MAX_TODOS } from "./constants.js";

// Данные из localStorage нельзя считать доверенными: их можно изменить
// вручную или другим скриптом на этом же origin. Берём только ожидаемые поля
// и приводим их к ожидаемым типам.
const sanitizeTodos = (data) => {
  if (!Array.isArray(data)) return [];

  const seenIds = new Set();
  const result = [];

  for (const item of data.slice(0, MAX_TODOS)) {
    if (!item || typeof item !== "object") continue;

    const id = item[todoKeys.id];
    const text = item[todoKeys.text];
    const isCompleted = item[todoKeys.is_completed];

    if (!Number.isSafeInteger(id) || id <= 0 || seenIds.has(id)) continue;
    if (typeof text !== "string" || !text.trim()) continue;

    seenIds.add(id);
    result.push({
      [todoKeys.id]: id,
      [todoKeys.text]: text.trim().slice(0, MAX_TEXT_LENGTH),
      [todoKeys.is_completed]: isCompleted === true,
    });
  }

  return result;
};

export const getTodosFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeTodos(JSON.parse(raw)) : [];
  } catch (error) {
    console.error("Не удалось прочитать todos из localStorage:", error);
    return [];
  }
};

export const setTodosToLocalStorage = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Не удалось сохранить todos в localStorage:", error);
  }
};
