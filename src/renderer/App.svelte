<script>
  import { onDestroy, onMount } from "svelte";
  import Sidebar from "./components/layout/Sidebar.svelte";
  import Header from "./components/layout/Header.svelte";
  import KeyboardHandler from "./components/layout/KeyboardHandler.svelte";
  import MainView from "./views/MainView.svelte";
  import ArchiveView from "./views/ArchiveView.svelte";
  import StatisticsView from "./views/StatisticsView.svelte";
  import SettingsView from "./views/SettingsView.svelte";
  import { currentPage, viewMode } from "$lib/stores/viewStore.js";
  import {
    archiveDailyTodos,
    archiveOverdueGlobalTodos,
    loadTodos,
  } from "$lib/stores/todoStore.js";
  import { loadStatistics } from "$lib/stores/statisticsStore.js";

  let autoArchiveInterval = null;
  let lastCheckedDate = new Date().toISOString().split("T")[0];

  // Reference to MainView
  let mainViewRef;

  function checkDayChange() {
    const today = new Date().toISOString().split("T")[0];

    if (today !== lastCheckedDate) {
      console.log(
          `Day changed from ${lastCheckedDate} to ${today}. Archiving old todos...`
      );
      archiveDailyTodos(lastCheckedDate);
      archiveOverdueGlobalTodos();
      lastCheckedDate = today;
    }
  }

  // Handle new task keyboard shortcut
  function handleNewTask() {
    // Navigate to main page if not already there
    if ($currentPage !== "main") {
      currentPage.set("main");
      // Wait for MainView to render, then trigger
      setTimeout(() => {
        mainViewRef?.triggerNewTask();
      }, 50);
    } else {
      mainViewRef?.triggerNewTask();
    }
  }

  onMount(async () => {
    await loadTodos();
    await loadStatistics();

    archiveOverdueGlobalTodos();

    autoArchiveInterval = setInterval(checkDayChange, 60 * 1000);
  });

  onDestroy(() => {
    if (autoArchiveInterval) {
      clearInterval(autoArchiveInterval);
    }
  });
</script>

<!-- Listen for newTask event -->
<KeyboardHandler on:newTask={handleNewTask} />

<div class="h-screen flex flex-col overflow-hidden">
  <Header />

  <div class="flex flex-1 overflow-hidden">
    <Sidebar />

    <main class="flex-1 overflow-auto p-4">
      {#if $currentPage === "main"}
        <MainView bind:this={mainViewRef} />
      {:else if $currentPage === "archive"}
        <ArchiveView />
      {:else if $currentPage === "statistics"}
        <StatisticsView />
      {:else if $currentPage === "settings"}
        <SettingsView />
      {/if}
    </main>
  </div>
</div>
