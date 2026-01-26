<script>
  import { onMount } from "svelte";
  import { Folder, FolderOpen, Info, Power, Settings, X, } from "lucide-svelte";
  import { loadSettings, setAutoLaunch, settings, } from "$lib/stores/settingsStore.js";
  import {
    clearWorkingDirectory,
    loadWorkingDirectory,
    selectWorkingDirectory,
    workingDirectory,
  } from "$lib/stores/fileStore.js";

  onMount(() => {
    loadSettings();
    loadWorkingDirectory();
  });

  async function handleAutoLaunchToggle() {
    await setAutoLaunch(!$settings.autoLaunch);
  }

  async function handleSelectFolder() {
    await selectWorkingDirectory();
  }

  async function handleClearFolder() {
    await clearWorkingDirectory();
  }

  function getFolderName(path) {
    if (!path) return "";
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || path;
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
    <div class="card">
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
        <button
          class="relative w-12 h-6 rounded-full transition-colors {$settings.autoLaunch
            ? 'bg-primary'
            : 'bg-surface-lighter'}"
          on:click="{handleAutoLaunchToggle}"
        >
          <span
            class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
                   {$settings.autoLaunch ? 'translate-x-7' : 'translate-x-1'}"
          ></span>
        </button>
      </div>
    </div>

    <!-- File Explorer Section -->
    <div class="card">
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

    <!-- About Section -->
    <div class="card">
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
          <span class="text-on-surface">Electron + Svelte</span>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts -->
    <div class="card">
      <h3 class="text-sm font-medium text-gray-400 mb-4">Keyboard Shortcuts</h3>

      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Previous day</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">←</kbd>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Next day</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">→</kbd>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-400">Close dialog</span>
          <kbd class="px-2 py-1 bg-surface-lighter rounded text-xs">Esc</kbd>
        </div>
      </div>
    </div>
  </div>
</div>
