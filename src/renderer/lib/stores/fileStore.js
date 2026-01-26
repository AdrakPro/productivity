import { get, writable } from "svelte/store";
import { filesApi } from "$lib/services/api.js";

export const fileTree = writable(null);
export const workingDirectory = writable(null);
export const isLoading = writable(false);
export const error = writable(null);

export const expandedFolders = writable(new Set());

export async function loadWorkingDirectory() {
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

export async function selectWorkingDirectory() {
  isLoading.set(true);
  error.set(null);

  try {
    const dir = await filesApi.selectDirectory();
    if (dir) {
      workingDirectory.set(dir);
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

export async function loadFileTree(dirPath) {
  if (!dirPath) return;

  isLoading.set(true);
  error.set(null);

  try {
    const tree = await filesApi.getTree(dirPath);
    fileTree.set(tree);

    // Auto-expand root folder
    if (tree) {
      expandedFolders.update((set) => {
        const newSet = new Set(set);
        newSet.add(tree.path);
        return newSet;
      });
    }
  } catch (err) {
    console.error("Failed to load file tree:", err);
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
}

export async function refreshFileTree() {
  const dir = get(workingDirectory);

  if (dir) {
    await loadFileTree(dir);
  }
}

export async function openFile(filePath) {
  try {
    await filesApi.openFile(filePath);
  } catch (err) {
    console.error("Failed to open file:", err);
    error.set(err.message);
  }
}

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
}

export function isFolderExpanded(path) {
  let expanded = false;
  const unsubscribe = expandedFolders.subscribe((set) => {
    expanded = set.has(path);
  });
  unsubscribe();
  return expanded;
}

export async function clearWorkingDirectory() {
  workingDirectory.set(null);
  fileTree.set(null);
  expandedFolders.set(new Set());
  await filesApi.setWorkingDirectory(null);
}
