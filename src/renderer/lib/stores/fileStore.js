import { writable, get } from "svelte/store";
import { filesApi } from "$lib/services/api.js";

// File tree structure
export const fileTree = writable(null);

// Working directory path
export const workingDirectory = writable(null);

// Loading state
export const isLoading = writable(false);

// Error state
export const error = writable(null);

// Expanded folders (set of paths)
export const expandedFolders = writable(new Set());

// Load expanded folders from localStorage
function loadExpandedFolders() {
  try {
    const saved = localStorage.getItem("expandedFolders");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        expandedFolders.set(new Set(parsed));
      }
    }
  } catch (err) {
    console.error("Failed to load expanded folders:", err);
  }
}

// Save expanded folders to localStorage
function saveExpandedFolders() {
  try {
    const folders = get(expandedFolders);
    localStorage.setItem("expandedFolders", JSON.stringify([...folders]));
  } catch (err) {
    console.error("Failed to save expanded folders:", err);
  }
}

// Load working directory from settings
export async function loadWorkingDirectory() {
  loadExpandedFolders();

  try {
    const dir = await filesApi.getWorkingDirectory();
    workingDirectory.set(dir);
    if (dir) {
      await loadFileTree(dir);
    }
  } catch (err) {
    console.error("Failed to load working directory:", err);
    error.set(err.message);
  }
}

// Select a new working directory
export async function selectWorkingDirectory() {
  isLoading.set(true);
  error.set(null);

  try {
    const dir = await filesApi.selectDirectory();
    if (dir) {
      workingDirectory.set(dir);
      // Reset expanded folders for new directory
      expandedFolders.set(new Set());
      await loadFileTree(dir);
    }
    return dir;
  } catch (err) {
    console.error("Failed to select directory:", err);
    error.set(err.message);
    return null;
  } finally {
    isLoading.set(false);
  }
}

// Load file tree for a directory
export async function loadFileTree(dirPath) {
  if (!dirPath) return;

  isLoading.set(true);
  error.set(null);

  try {
    const tree = await filesApi.getTree(dirPath);
    fileTree.set(tree);

    // Auto-expand root folder if no saved state
    if (tree) {
      const currentExpanded = get(expandedFolders);
      if (currentExpanded.size === 0) {
        expandedFolders.update((set) => {
          const newSet = new Set(set);
          newSet.add(tree.path);
          return newSet;
        });
        saveExpandedFolders();
      }
    }
  } catch (err) {
    console.error("Failed to load file tree:", err);
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

// Refresh file tree
export async function refreshFileTree() {
  const dir = get(workingDirectory);

  if (dir) {
    await loadFileTree(dir);
  }
}

// Open file with system default application
export async function openFile(filePath) {
  try {
    await filesApi.openFile(filePath);
  } catch (err) {
    console.error("Failed to open file:", err);
    error.set(err.message);
  }
}

// Toggle folder expansion
export function toggleFolder(path) {
  expandedFolders.update((set) => {
    const newSet = new Set(set);
    if (newSet.has(path)) {
      newSet.delete(path);
    } else {
      newSet.add(path);
    }
    return newSet;
  });

  // Save to localStorage
  saveExpandedFolders();
}

// Check if folder is expanded
export function isFolderExpanded(path) {
  let expanded = false;
  const unsubscribe = expandedFolders.subscribe((set) => {
    expanded = set.has(path);
  });
  unsubscribe();
  return expanded;
}

// Clear working directory
export async function clearWorkingDirectory() {
  workingDirectory.set(null);
  fileTree.set(null);
  expandedFolders.set(new Set());
  localStorage.removeItem("expandedFolders");
  await filesApi.setWorkingDirectory(null);
}
