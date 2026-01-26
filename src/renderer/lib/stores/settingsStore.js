import { writable } from "svelte/store";
import { appApi } from "$lib/services/api.js";

// Settings state
export const settings = writable({
  autoLaunch: false,
  appVersion: "1.0.0",
});

// Loading state
export const isLoading = writable(false);

// Error state
export const error = writable(null);

// Load all settings
export async function loadSettings() {
  isLoading.set(true);
  error.set(null);

  try {
    const [autoLaunch, appVersion] = await Promise.all([
      appApi.getAutoLaunch(),
      appApi.getVersion(),
    ]);

    settings.set({
      autoLaunch,
      appVersion,
    });
  } catch (err) {
    console.error("Failed to load settings:", err);
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

// Toggle auto-launch
export async function setAutoLaunch(enabled) {
  error.set(null);

  try {
    await appApi.setAutoLaunch(enabled);
    settings.update((s) => ({ ...s, autoLaunch: enabled }));
  } catch (err) {
    console.error("Failed to set auto-launch:", err);
    error.set(err.message);
  }
}
