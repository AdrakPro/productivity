import { writable, derived } from "svelte/store";
import { todos } from "./todoStore.js";

// Search/filter state
export const archiveSearchMode = writable("all"); // 'all' | 'single' | 'range'
export const archiveSingleDate = writable("");
export const archiveDateFrom = writable("");
export const archiveDateTo = writable("");
export const archiveSearchText = writable("");

// Selected todo for detail dialog
export const selectedArchivedTodo = writable(null);
export const isDetailDialogOpen = writable(false);

// Archived todos derived from main todos store
export const archivedTodos = derived(todos, ($todos) => {
  return $todos.filter((todo) => todo.is_archived);
});

// Filtered archived todos based on search criteria
export const filteredArchivedTodos = derived(
  [
    archivedTodos,
    archiveSearchMode,
    archiveSingleDate,
    archiveDateFrom,
    archiveDateTo,
    archiveSearchText,
  ],
  ([$todos, $mode, $singleDate, $dateFrom, $dateTo, $searchText]) => {
    let filtered = [...$todos];

    // Filter by date based on mode
    if ($mode === "single" && $singleDate) {
      filtered = filtered.filter((todo) => {
        const todoDate = todo.is_global
          ? todo.due_date
          : todo.completed_at?.split("T")[0] || todo.due_date;
        return todoDate === $singleDate;
      });
    } else if ($mode === "range" && $dateFrom && $dateTo) {
      filtered = filtered.filter((todo) => {
        const todoDate = todo.is_global
          ? todo.due_date
          : todo.completed_at?.split("T")[0] || todo.due_date;
        return todoDate >= $dateFrom && todoDate <= $dateTo;
      });
    }

    if ($searchText.trim()) {
      const search = $searchText.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(search) ||
          todo.subtasks?.some((s) => s.title.toLowerCase().includes(search)),
      );
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => {
      const dateA = a.completed_at || a.due_date || "";
      const dateB = b.completed_at || b.due_date || "";
      return dateB.localeCompare(dateA);
    });

    return filtered;
  },
);

export function openTodoDetail(todo) {
  selectedArchivedTodo.set(todo);
  isDetailDialogOpen.set(true);
}

export function closeTodoDetail() {
  selectedArchivedTodo.set(null);
  isDetailDialogOpen.set(false);
}

export function resetFilters() {
  archiveSearchMode.set("all");
  archiveSingleDate.set("");
  archiveDateFrom.set("");
  archiveDateTo.set("");
  archiveSearchText.set("");
}
