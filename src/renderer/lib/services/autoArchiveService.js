import { get } from "svelte/store";
import { archiveDailyTodos, todos } from "$lib/stores/todoStore.js";

let lastCheckedDate = new Date().toISOString().split("T")[0];
let checkInterval = null;

function checkDayChange() {
  const today = new Date().toISOString().split("T")[0];

  if (today !== lastCheckedDate) {
    console.log(
      `Day changed from ${lastCheckedDate} to ${today}. Archiving old todos...`,
    );
    archiveDailyTodos(lastCheckedDate);
    lastCheckedDate = today;
  }
}

export function startAutoArchiveService() {
  checkDayChange();

  // Check every minute
  checkInterval = setInterval(checkDayChange, 60 * 1000);

  console.log("Auto-archive service started");
}

export function stopAutoArchiveService() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  console.log("Auto-archive service stopped");
}

export function archivePastTodos() {
  const today = new Date().toISOString().split("T")[0];
  const $todos = get(todos);

  // Find all unique past dates with unarchived daily todos
  const pastDates = new Set();
  $todos.forEach((todo) => {
    if (
      !todo.is_global &&
      !todo.is_archived &&
      todo.due_date &&
      todo.due_date < today
    ) {
      pastDates.add(todo.due_date);
    }
  });

  pastDates.forEach((date) => {
    console.log(`Archiving todos for past date: ${date}`);
    archiveDailyTodos(date);
  });
}
