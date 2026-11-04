const STORAGE_KEY = "todos";

export const getTodosFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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