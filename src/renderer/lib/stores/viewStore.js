import { derived, get, writable } from "svelte/store";

// Current page: 'main' | 'archive' | 'statistics'
export const currentPage = writable("main");

// View mode: 'daily' | 'global'
export const viewMode = writable("daily");

// Selected date for daily view (ISO string: YYYY-MM-DD)
const today = new Date().toISOString().split("T")[0];
export const selectedDate = writable(today);

// Helper to parse date without timezone issues
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Helper to format date to YYYY-MM-DD
function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Derived store for display-friendly date
export const selectedDateFormatted = derived(selectedDate, ($date) => {
  const date = parseLocalDate($date);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Short formatted date (DD.MM.YYYY)
export const selectedDateShort = derived(selectedDate, ($date) => {
  const date = parseLocalDate($date);
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
});

// Check if selected date is today
export const isToday = derived(selectedDate, ($date) => {
  return $date === formatDateToISO(new Date());
});

// Check if selected date is in the past
export const isPastDate = derived(selectedDate, ($date) => {
  const todayStr = formatDateToISO(new Date());
  return $date < todayStr;
});

// Check if selected date is in the future
export const isFutureDate = derived(selectedDate, ($date) => {
  const todayStr = formatDateToISO(new Date());
  return $date > todayStr;
});

// Navigation functions for daily view
export function goToPreviousDay() {
  const current = get(selectedDate);
  const date = parseLocalDate(current);
  date.setDate(date.getDate() - 1);
  selectedDate.set(formatDateToISO(date));
}

export function goToNextDay() {
  const current = get(selectedDate);
  const date = parseLocalDate(current);
  date.setDate(date.getDate() + 1);
  selectedDate.set(formatDateToISO(date));
}

export function goToToday() {
  selectedDate.set(formatDateToISO(new Date()));
}
