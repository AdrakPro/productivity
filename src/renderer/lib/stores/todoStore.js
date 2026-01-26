import { writable, derived, get } from 'svelte/store';
import { viewMode, selectedDate } from './viewStore.js';
import { todosApi, subtasksApi } from '$lib/services/api.js';

// All todos from database (with subtasks embedded)
export const todos = writable([]);

// Loading state
export const isLoading = writable(false);

// Error state
export const error = writable(null);

export const filteredTodos = derived(
  [todos, viewMode, selectedDate],
  ([$todos, $viewMode, $selectedDate]) => {
    if ($viewMode === 'global') {
      return $todos.filter((todo) => todo.is_global && !todo.is_archived);
    } else {
      return $todos.filter(
        (todo) => !todo.is_global && todo.due_date === $selectedDate && !todo.is_archived
      );
    }
  }
);

export function getTodoProgress(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) {
    return { completed: 0, total: 0, percentage: 0, isFullyCompleted: false };
  }
  const completed = todo.subtasks.filter((s) => s.is_completed).length;
  const total = todo.subtasks.length;
  const percentage = Math.round((completed / total) * 100);
  const isFullyCompleted = completed === total;
  return { completed, total, percentage, isFullyCompleted };
}

export function isAllSubtasksCompleted(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) return false;
  return todo.subtasks.every((s) => s.is_completed);
}

export function isTodoDone(todo) {
  if (todo.is_completed) return true;
  if (todo.subtasks && todo.subtasks.length > 0) {
    return todo.subtasks.every((s) => s.is_completed);
  }
  return false;
}

export const pendingCount = derived(filteredTodos, ($filtered) => {
  return $filtered.filter((todo) => !isTodoDone(todo)).length;
});

// ============ API Operations ============
export async function loadTodos() {
  isLoading.set(true);
  error.set(null);

  try {
    const data = await todosApi.getAll();
    todos.set(data);
  } catch (err) {
    console.error('Failed to load todos:', err);
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

export async function addTodo(todoData) {
  error.set(null);

  try {
    const newTodo = await todosApi.create(todoData);
    todos.update((list) => [...list, newTodo]);
    return newTodo;
  } catch (err) {
    console.error('Failed to add todo:', err);
    error.set(err.message);
    throw err;
  }
}

export async function updateTodo(id, updates) {
  error.set(null);

  try {
    const updatedTodo = await todosApi.update(id, updates);
    todos.update((list) =>
      list.map((todo) => (todo.id === id ? updatedTodo : todo))
    );
    return updatedTodo;
  } catch (err) {
    console.error('Failed to update todo:', err);
    error.set(err.message);
    throw err;
  }
}

export async function deleteTodo(id) {
  error.set(null);

  try {
    await todosApi.delete(id);
    todos.update((list) => list.filter((todo) => todo.id !== id));
  } catch (err) {
    console.error('Failed to delete todo:', err);
    error.set(err.message);
    throw err;
  }
}

export async function archiveTodo(id) {
  error.set(null);

  try {
    const archivedTodo = await todosApi.archive(id);
    if (archivedTodo) {
      todos.update((list) =>
        list.map((todo) => (todo.id === id ? archivedTodo : todo))
      );
    }
    return archivedTodo;
  } catch (err) {
    console.error('Failed to archive todo:', err);
    error.set(err.message);
    throw err;
  }
}

export async function archiveDailyTodos(date) {
  error.set(null);

  try {
    await todosApi.archiveByDate(date);
    // Reload todos to get updated state
    await loadTodos();
  } catch (err) {
    console.error('Failed to archive daily todos:', err);
    error.set(err.message);
    throw err;
  }
}

// ============ Subtask Operations ============
export async function addSubtask(todoId, title) {
  error.set(null);

  try {
    const newSubtask = await subtasksApi.create(todoId, title);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: [...(todo.subtasks || []), newSubtask],
          };
        }
        return todo;
      })
    );

    return newSubtask;
  } catch (err) {
    console.error('Failed to add subtask:', err);
    error.set(err.message);
    throw err;
  }
}

export async function updateSubtask(todoId, subtaskId, updates) {
  error.set(null);

  try {
    const updatedSubtask = await subtasksApi.update(subtaskId, updates);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          const subtasks = todo.subtasks.map((s) =>
            s.id === subtaskId ? updatedSubtask : s
          );

          // Check if all subtasks are completed
          const allCompleted = subtasks.length > 0 && subtasks.every((s) => s.is_completed);

          return {
            ...todo,
            subtasks,
            is_completed: allCompleted,
            completed_at: allCompleted ? new Date().toISOString() : todo.completed_at,
          };
        }
        return todo;
      })
    );

    return updatedSubtask;
  } catch (err) {
    console.error('Failed to update subtask:', err);
    error.set(err.message);
    throw err;
  }
}

export async function deleteSubtask(todoId, subtaskId) {
  error.set(null);

  try {
    await subtasksApi.delete(subtaskId);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          const subtasks = todo.subtasks.filter((s) => s.id !== subtaskId);

          // Recalculate completion status
          const allCompleted = subtasks.length > 0 && subtasks.every((s) => s.is_completed);

          return {
            ...todo,
            subtasks,
            is_completed: allCompleted,
          };
        }
        return todo;
      })
    );
  } catch (err) {
    console.error('Failed to delete subtask:', err);
    error.set(err.message);
    throw err;
  }
}
