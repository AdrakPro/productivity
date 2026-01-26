import { writable } from "svelte/store";

// Toast types: 'success' | 'error' | 'info' | 'warning'
export const toasts = writable([]);

let toastId = 0;

/**
 * Add a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type
 * @param {number} duration - Duration in ms (0 = no auto-dismiss)
 * @param {object} action - Optional action { label: string, onClick: function }
 */
export function addToast(
  message,
  type = "info",
  duration = 3000,
  action = null,
) {
  const id = ++toastId;

  const toast = {
    id,
    message,
    type,
    action,
  };

  toasts.update((all) => [...all, toast]);

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

/**
 * Dismiss a toast by ID
 */
export function dismissToast(id) {
  toasts.update((all) => all.filter((t) => t.id !== id));
}

/**
 * Clear all toasts
 */
export function clearToasts() {
  toasts.set([]);
}

// Convenience functions
export function success(message, duration = 3000, action = null) {
  return addToast(message, "success", duration, action);
}

export function error(message, duration = 5000, action = null) {
  return addToast(message, "error", duration, action);
}

export function info(message, duration = 3000, action = null) {
  return addToast(message, "info", duration, action);
}

export function warning(message, duration = 4000, action = null) {
  return addToast(message, "warning", duration, action);
}
