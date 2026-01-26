import { derived, writable } from "svelte/store";
import { selectedDate, viewMode } from "./viewStore.js";

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
  const isFullyCompleted = completed === total;
  return { completed, total, percentage, isFullyCompleted };
}

// Check if all subtasks are completed
export function isAllSubtasksCompleted(todo) {
  if (!todo.subtasks || todo.subtasks.length === 0) return false;
  return todo.subtasks.every((s) => s.is_completed);
}

// Check if a todo is considered "done" (either marked complete or all subtasks done)
export function isTodoDone(todo) {
  if (todo.is_completed) return true;
  if (todo.subtasks && todo.subtasks.length > 0) {
    return todo.subtasks.every((s) => s.is_completed);
  }
  return false;
}

// Completed todos count for selected date
export const completedToday = derived(
  [todos, selectedDate],
  ([$todos, $selectedDate]) => {
    return $todos.filter(
      (todo) =>
        isTodoDone(todo) && todo.due_date === $selectedDate && !todo.is_global,
    ).length;
  },
);

// Pending todos count (todos that are NOT fully done)
export const pendingCount = derived(filteredTodos, ($filtered) => {
  return $filtered.filter((todo) => !isTodoDone(todo)).length;
});

// CRUD Operations (will connect to IPC in Phase 2)

export function addTodo(todoData) {
  const newTodo = {
    id: Date.now(), // Temporary ID
    title: todoData.title,
    description: todoData.description || "",
    due_date: todoData.due_date,
    is_global: todoData.is_global || false,
    is_completed: false,
    is_archived: false,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subtasks: [],
  };
  todos.update((list) => [...list, newTodo]);
  return newTodo;
}

export function updateTodo(id, updates) {
  todos.update((list) =>
    list.map((todo) =>
      todo.id === id
        ? { ...todo, ...updates, updated_at: new Date().toISOString() }
        : todo,
    ),
  );
}

export function deleteTodo(id) {
  todos.update((list) => list.filter((todo) => todo.id !== id));
}

export function addSubtask(todoId, title) {
  const newSubtask = {
    id: Date.now(),
    todo_id: todoId,
    title,
    is_completed: false,
    sort_order: 0,
    completed_at: null,
    created_at: new Date().toISOString(),
  };

  todos.update((list) =>
    list.map((todo) => {
      if (todo.id === todoId) {
        const subtasks = [...(todo.subtasks || []), newSubtask];
        // Update sort order
        subtasks.forEach((s, i) => (s.sort_order = i));
        return { ...todo, subtasks, updated_at: new Date().toISOString() };
      }
      return todo;
    }),
  );

  return newSubtask;
}

export function updateSubtask(todoId, subtaskId, updates) {
  todos.update((list) =>
    list.map((todo) => {
      if (todo.id === todoId) {
        const subtasks = todo.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? {
                ...subtask,
                ...updates,
                completed_at: updates.is_completed
                  ? new Date().toISOString()
                  : null,
              }
            : subtask,
        );

        // Check if all subtasks are now completed
        const allCompleted =
          subtasks.length > 0 && subtasks.every((s) => s.is_completed);

        return {
          ...todo,
          subtasks,
          is_completed: allCompleted,
          completed_at: allCompleted
            ? new Date().toISOString()
            : todo.completed_at,
          updated_at: new Date().toISOString(),
        };
      }
      return todo;
    }),
  );
}

export function deleteSubtask(todoId, subtaskId) {
  todos.update((list) =>
    list.map((todo) => {
      if (todo.id === todoId) {
        const subtasks = todo.subtasks.filter((s) => s.id !== subtaskId);
        subtasks.forEach((s, i) => (s.sort_order = i));

        // Recalculate completion status
        const allCompleted =
          subtasks.length > 0 && subtasks.every((s) => s.is_completed);

        return {
          ...todo,
          subtasks,
          is_completed: allCompleted,
          updated_at: new Date().toISOString(),
        };
      }
      return todo;
    }),
  );
}

export function archiveTodo(id) {
  todos.update((list) =>
    list.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            is_archived: true,
            is_completed: true,
            completed_at: todo.completed_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : todo,
    ),
  );
}

// Archive all completed daily todos for a specific date
export function archiveDailyTodos(date) {
  todos.update((list) =>
    list.map((todo) => {
      if (!todo.is_global && todo.due_date === date && !todo.is_archived) {
        return {
          ...todo,
          is_archived: true,
          completed_at: todo.completed_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      return todo;
    }),
  );
}
