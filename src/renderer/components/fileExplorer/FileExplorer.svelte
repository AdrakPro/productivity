<script>
  import { onMount } from "svelte";
  import { ChevronDown, Folder, FolderOpen, FolderPlus, RefreshCw, X, } from "lucide-svelte";
  import {
    clearWorkingDirectory,
    expandedFolders,
    fileTree,
    isLoading,
    loadWorkingDirectory,
    refreshFileTree,
    selectWorkingDirectory,
    toggleFolder,
    workingDirectory,
  } from "$lib/stores/fileStore.js";
  import FileTree from "./FileTree.svelte";

  onMount(() => {
    loadWorkingDirectory();
  });

  async function handleSelectDirectory() {
    await selectWorkingDirectory();
  }

  async function handleRefresh() {
    await refreshFileTree();
  }

  async function handleClear() {
    await clearWorkingDirectory();
  }

  function getFolderName(path) {
    if (!path) return "";
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || path;
  }

  $: isRootExpanded = $fileTree ? $expandedFolders.has($fileTree.path) : false;

  function toggleRoot() {
    if ($fileTree) {
      toggleFolder($fileTree.path);
    }
  }
</script>

<div class="p-3 h-full flex flex-col">
  <div class="flex items-center justify-between mb-3">
    <h3 class="font-medium text-sm text-gray-400 flex items-center gap-2">
      <Folder size="{16}" />
      File Explorer
    </h3>

    {#if $workingDirectory}
      <div class="flex items-center gap-1">
        <button
          class="p-1 rounded hover:bg-surface-lighter text-gray-500 hover:text-on-surface transition-colors"
          on:click="{handleRefresh}"
          title="Refresh"
          disabled="{$isLoading}"
        >
          <RefreshCw size="{14}" class="{$isLoading ? 'animate-spin' : ''}" />
        </button>
        <button
          class="p-1 rounded hover:bg-surface-lighter text-gray-500 hover:text-error transition-colors"
          on:click="{handleClear}"
          title="Close folder"
        >
          <X size="{14}" />
        </button>
      </div>
    {/if}
  </div>

  <!-- Content -->
  {#if $workingDirectory}
    <div class="flex-1 overflow-auto">
      {#if $fileTree}
        <button
          class="w-full flex items-center gap-1 py-1 px-1 rounded hover:bg-surface-lighter text-sm text-left transition-colors group mb-1"
          on:click="{toggleRoot}"
        >
          <ChevronDown
            size="{14}"
            class="text-gray-500 flex-shrink-0 transition-transform {isRootExpanded
              ? ''
              : '-rotate-90'}"
          />
          {#if isRootExpanded}
            <FolderOpen size="{16}" class="text-yellow-500 flex-shrink-0" />
          {:else}
            <Folder size="{16}" class="text-yellow-500 flex-shrink-0" />
          {/if}
          <span class="truncate text-on-surface font-medium"
            >{getFolderName($workingDirectory)}</span
          >
        </button>

        <!-- Children (if expanded) -->
        {#if isRootExpanded && $fileTree.children}
          <div class="ml-2">
            {#each $fileTree.children as child (child.path)}
              <FileTree node="{child}" depth="{0}" />
            {/each}
          </div>
        {/if}
      {:else if $isLoading}
        <div class="text-sm text-gray-500 text-center py-4">Loading...</div>
      {:else}
        <div class="text-sm text-gray-500 text-center py-4">No files found</div>
      {/if}
    </div>
  {:else}
    <!-- No folder selected -->
    <div class="flex-1 flex flex-col items-center justify-center text-center">
      <FolderOpen size="{32}" class="text-gray-600 mb-3" />
      <p class="text-sm text-gray-500 mb-3">No folder selected</p>
      <button
        class="btn btn-ghost text-sm flex items-center gap-2"
        on:click="{handleSelectDirectory}"
        disabled="{$isLoading}"
      >
        <FolderPlus size="{16}" />
        Open Folder
      </button>
    </div>
  {/if}
</div>
