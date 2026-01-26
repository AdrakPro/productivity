<script>
  import { onMount } from "svelte";
  import {
    Settings,
    Folder,
    Power,
    Info,
    FolderOpen,
    X,
    Download,
    Upload,
    Keyboard,
  } from "lucide-svelte";
  import {
    settings,
    loadSettings,
    setAutoLaunch,
  } from "$lib/stores/settingsStore.js";
  import {
    workingDirectory,
    selectWorkingDirectory,
    clearWorkingDirectory,
    loadWorkingDirectory,
  } from "$lib/stores/fileStore.js";
  import { exportTodos, importTodos } from "$lib/stores/todoStore.js";
  import ToggleSwitch from "$components/common/ToggleSwitch.svelte";

  let fileInput;

  onMount(() => {
    loadSettings();
    loadWorkingDirectory();
  });

  async function handleAutoLaunchChange(event) {
    await setAutoLaunch(event.detail.checked);
  }

  async function handleSelectFolder() {
    await selectWorkingDirectory();
  }

  async function handleClearFolder() {
    await clearWorkingDirectory();
  }

  function handleExport() {
    exportTodos();
  }

  function handleImportClick() {
    fileInput?.click();
  }

  async function handleFileSelected(event) {
    const file = event.target.files?.[0];
    if (file) {
      await importTodos(file);
      event.target.value = "";
    }
  }
</script>

<div class="h-full flex flex-col overflow-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-on-surface flex items-center gap-2">
      <Settings size="{28}" />
      Settings
    </h1>
    <p class="text-gray-400 text-sm mt-1">Configure your app preferences</p>
  </div>

  <!-- Settings Sections -->
  <div class="space-y-6">
    <!-- Startup Section -->
    <div class="card animate-fadeIn">
      <h3
        class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
      >
        <Power size="{16}" />
        Startup
      </h3>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-on-surface font-medium">Launch at startup</p>
          <p class="text-sm text-gray-500">
            Automatically start the app when you log in
          </p>
        </div>

        <ToggleSwitch
          checked="{$settings.autoLaunch}"
          on:change="{handleAutoLaunchChange}"
        />
      </div>
    </div>

    <!-- File Explorer Section -->
    <div class="card animate-fadeIn" style="animation-delay: 50ms">
      <h3
        class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
      >
        <Folder size="{16}" />
        File Explorer
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-on-surface font-medium mb-2">Working Directory</p>
          <p class="text-sm text-gray-500 mb-3">
            Select a folder to browse in the file explorer sidebar
          </p>

          {#if $workingDirectory}
            <div class="flex items-center gap-2">
              <div
                class="flex-1 bg-surface-lighter rounded-lg px-3 py-2 text-sm truncate"
              >
                <span class="text-gray-400">📁</span>
                <span class="ml-2 text-on-surface">{$workingDirectory}</span>
              </div>
              <button
                class="btn btn-ghost p-2"
                on:click="{handleClearFolder}"
                title="Remove folder"
              >
                <X size="{18}" />
              </button>
            </div>
          {:else}
            <button
              class="btn btn-ghost flex items-center gap-2"
              on:click="{handleSelectFolder}"
            >
              <FolderOpen size="{18}" />
              Select Folder
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Data Management Section -->
    <div class="card animate-fadeIn" style="animation-delay: 100ms">
      <h3
        class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
      >
        <Download size="{16}" />
        Data Management
      </h3>

      <div class="space-y-4">
        <div>
          <p class="text-on-surface font-medium mb-2">Export & Import</p>
          <p class="text-sm text-gray-500 mb-3">
            Backup your tasks or restore from a previous backup
          </p>

          <div class="flex gap-3">
            <button
              class="btn btn-ghost flex items-center gap-2"
              on:click="{handleExport}"
            >
              <Download size="{18}" />
              Export Data
            </button>

            <button
              class="btn btn-ghost flex items-center gap-2"
              on:click="{handleImportClick}"
            >
              <Upload size="{18}" />
              Import Data
            </button>

            <input
              bind:this="{fileInput}"
              type="file"
              accept=".json"
              class="hidden"
              on:change="{handleFileSelected}"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts -->
    <div class="card animate-fadeIn" style="animation-delay: 150ms">
      <h3
        class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
      >
        <Keyboard size="{16}" />
        Keyboard Shortcuts
      </h3>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">New task</span>
          <div class="flex gap-1 items-center">
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">N</kbd>
            <span class="text-gray-600 text-xs">or</span>
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Ctrl</kbd>
            <span class="text-gray-600 text-xs">+</span>
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">N</kbd>
          </div>
        </div>
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">Save task (when editing)</span>
          <div class="flex gap-1 items-center">
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Ctrl</kbd>
            <span class="text-gray-600 text-xs">+</span>
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Enter</kbd
            >
          </div>
        </div>
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">Go to today</span>
          <div class="flex gap-1 items-center">
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">T</kbd>
            <span class="text-gray-600 text-xs">or</span>
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Ctrl</kbd>
            <span class="text-gray-600 text-xs">+</span>
            <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">B</kbd>
          </div>
        </div>
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">Previous day</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">←</kbd>
        </div>
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">Next day</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">→</kbd>
        </div>
        <div class="flex items-center justify-between py-1">
          <span class="text-gray-400">Cancel / Close dialog</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Esc</kbd>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div class="card animate-fadeIn" style="animation-delay: 200ms">
      <h3
        class="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2"
      >
        <Info size="{16}" />
        About
      </h3>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Version</span>
          <span class="text-on-surface">{$settings.appVersion}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Built with</span>
          <span class="text-on-surface">Electron + Svelte + SQLite</span>
        </div>
      </div>
    </div>
  </div>
</div>
