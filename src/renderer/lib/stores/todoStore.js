import { writable, derived, get } from "svelte/store";
import { viewMode, selectedDate } from "./viewStore.js";
import { todosApi, subtasksApi } from "$lib/services/api.js";

// All todos from database (with subtasks embedded)
export const todos = writable([]);

// Loading state
export const isLoading = writable(false);

// Error state
export const error = writable(null);

// Filtered todos based on view mode and selected date
export const filteredTodos = derived(
  [todos, viewMode, selectedDate],
  ([$todos, $viewMode, $selectedDate]) => {
    if ($viewMode === "global") {
      return $todos.filter((todo) => todo.is_global && !todo.is_archived);
    } else {
      return $todos.filter(
        (todo) =>
          !todo.is_global &&
          todo.due_date === $selectedDate &&
          !todo.is_archived,
      );
    }
  },
);

// Get todo progress (completed subtasks / total subtasks)
export function getTodoProgress(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) {
    return { completed: 0, total: 0, percentage: 0, isFullyCompleted: false };
  }
  const completed = todo.subtasks.filter((s) => s.is_completed).length;
  const total = todo.subtasks.length;
  const percentage = Math.round((completed / total) * 100);
  const isFullyCompleted = completed === total && total > 0;
  return { completed, total, percentage, isFullyCompleted };
}

// Check if all subtasks are completed
export function isAllSubtasksCompleted(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) return false;
  return todo.subtasks.every((s) => s.is_completed);
}

// Check if a todo is considered "done" (all subtasks done, or no subtasks and marked complete)
export function isTodoDone(todo) {
  // If has subtasks, check if all are completed
  if (todo.subtasks && todo.subtasks.length > 0) {
    return todo.subtasks.every((s) => s.is_completed);
  }
  // If no subtasks, use the is_completed flag
  return todo.is_completed;
}

// Pending todos count (todos that are NOT fully done)
export const pendingCount = derived(filteredTodos, ($filtered) => {
  return $filtered.filter((todo) => !isTodoDone(todo)).length;
});

// ============ API Operations ============

// Load all todos from database
export async function loadTodos() {
  isLoading.set(true);
  error.set(null);

  try {
    const data = await todosApi.getAll();
    todos.set(data);
  } catch (err) {
    console.error("Failed to load todos:", err);
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

// Add a new todo
export async function addTodo(todoData) {
  error.set(null);

  try {
    const newTodo = await todosApi.create(todoData);
    todos.update((list) => [...list, newTodo]);
    return newTodo;
  } catch (err) {
    console.error("Failed to add todo:", err);
    error.set(err.message);
    throw err;
  }
}

// Update a todo
export async function updateTodo(id, updates) {
  error.set(null);

  try {
    const updatedTodo = await todosApi.update(id, updates);
    todos.update((list) =>
      list.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
    return updatedTodo;
  } catch (err) {
    console.error("Failed to update todo:", err);
    error.set(err.message);
    throw err;
  }
}

// Delete a todo
export async function deleteTodo(id) {
  error.set(null);

  try {
    await todosApi.delete(id);
    todos.update((list) => list.filter((todo) => todo.id !== id));
  } catch (err) {
    console.error("Failed to delete todo:", err);
    error.set(err.message);
    throw err;
  }
}

// Archive a todo
export async function archiveTodo(id) {
  error.set(null);

  try {
    const archivedTodo = await todosApi.archive(id);
    if (archivedTodo) {
      todos.update((list) =>
        list.map((todo) => (todo.id === id ? archivedTodo : todo)),
      );
    }
    return archivedTodo;
  } catch (err) {
    console.error("Failed to archive todo:", err);
    error.set(err.message);
    throw err;
  }
}

// Archive all daily todos for a specific date
export async function archiveDailyTodos(date) {
  error.set(null);

  try {
    await todosApi.archiveByDate(date);
    // Reload todos to get updated state
    await loadTodos();
  } catch (err) {
    console.error("Failed to archive daily todos:", err);
    error.set(err.message);
    throw err;
  }
}

// Archive overdue global tasks (deadline passed)
export async function archiveOverdueGlobalTodos() {
  const today = new Date().toISOString().split("T")[0];
  const $todos = get(todos);

  const overdueTodos = $todos.filter(
    (todo) =>
      todo.is_global &&
      todo.due_date &&
      todo.due_date < today &&
      !todo.is_archived,
  );

  for (const todo of overdueTodos) {
    try {
      await archiveTodo(todo.id);
      console.log(`Archived overdue global task: ${todo.title}`);
    } catch (err) {
      console.error(`Failed to archive overdue task ${todo.id}:`, err);
    }
  }
}

// ============ Subtask Operations ============

// Helper to recalculate todo completion status based on subtasks
function recalculateTodoCompletion(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) {
    return {
      ...todo,
      is_completed: false,
      completed_at: null,
    };
  }

  const allCompleted = todo.subtasks.every((s) => s.is_completed);

  return {
    ...todo,
    is_completed: allCompleted,
    completed_at: allCompleted
      ? todo.completed_at || new Date().toISOString()
      : null,
  };
}

// Add a subtask
export async function addSubtask(todoId, title) {
  error.set(null);

  try {
    const newSubtask = await subtasksApi.create(todoId, title);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          const updatedTodo = {
            ...todo,
            subtasks: [...(todo.subtasks || []), newSubtask],
          };
          // Recalculate completion - new subtask is not completed, so todo can't be complete
          return recalculateTodoCompletion(updatedTodo);
        }
        return todo;
      }),
    );

    return newSubtask;
  } catch (err) {
    console.error("Failed to add subtask:", err);
    error.set(err.message);
    throw err;
  }
}

// Update a subtask
export async function updateSubtask(todoId, subtaskId, updates) {
  error.set(null);

  try {
    const updatedSubtask = await subtasksApi.update(subtaskId, updates);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          const subtasks = todo.subtasks.map((s) =>
            s.id === subtaskId ? updatedSubtask : s,
          );

          const updatedTodo = {
            ...todo,
            subtasks,
          };

          // Recalculate completion status
          return recalculateTodoCompletion(updatedTodo);
        }
        return todo;
      }),
    );

    return updatedSubtask;
  } catch (err) {
    console.error("Failed to update subtask:", err);
    error.set(err.message);
    throw err;
  }
}

// Delete a subtask
export async function deleteSubtask(todoId, subtaskId) {
  error.set(null);

  try {
    await subtasksApi.delete(subtaskId);

    todos.update((list) =>
      list.map((todo) => {
        if (todo.id === todoId) {
          const subtasks = todo.subtasks.filter((s) => s.id !== subtaskId);

          const updatedTodo = {
            ...todo,
            subtasks,
          };

          // Recalculate completion status
          return recalculateTodoCompletion(updatedTodo);
        }
        return todo;
      }),
    );
  } catch (err) {
    console.error("Failed to delete subtask:", err);
    error.set(err.message);
    throw err;
  }
}
