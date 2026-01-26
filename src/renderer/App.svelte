<script>
  import { onMount, onDestroy } from "svelte";
  import Sidebar from "./components/layout/Sidebar.svelte";
  import Header from "./components/layout/Header.svelte";
  import KeyboardHandler from "./components/layout/KeyboardHandler.svelte";
  import MainView from "./views/MainView.svelte";
  import ArchiveView from "./views/ArchiveView.svelte";
  import StatisticsView from "./views/StatisticsView.svelte";
  import { currentPage } from "$lib/stores/viewStore.js";
  import {
    loadTodos,
    archiveDailyTodos,
    archiveOverdueGlobalTodos,
  } from "$lib/stores/todoStore.js";
  import { loadStatistics } from "$lib/stores/statisticsStore.js";

  let autoArchiveInterval = null;
  let lastCheckedDate = new Date().toISOString().split("T")[0];

  // Check if day has changed and archive previous day's todos
  function checkDayChange() {
    const today = new Date().toISOString().split("T")[0];

    if (today !== lastCheckedDate) {
      console.log(
        `Day changed from ${lastCheckedDate} to ${today}. Archiving old todos...`,
      );
      archiveDailyTodos(lastCheckedDate);
      archiveOverdueGlobalTodos();
      lastCheckedDate = today;
    }
  }

  onMount(async () => {
    // Load initial data
    await loadTodos();
    await loadStatistics();

    // Archive overdue global tasks on startup
    archiveOverdueGlobalTodos();

    // Start auto-archive check (every minute)
    autoArchiveInterval = setInterval(checkDayChange, 60 * 1000);
  });

  onDestroy(() => {
    if (autoArchiveInterval) {
      clearInterval(autoArchiveInterval);
    }
  });
</script>

<!-- Global Keyboard Handler -->
<KeyboardHandler />

<div class="h-screen flex flex-col overflow-hidden">
  <!-- Header with navigation -->
  <Header />

  <!-- Main Content Area -->
  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar: File Explorer + Calendar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-auto p-4">
      {#if $currentPage === "main"}
        <MainView />
      {:else if $currentPage === "archive"}
        <ArchiveView />
      {:else if $currentPage === "statistics"}
        <StatisticsView />
      {/if}
    </main>
  </div>
</div>
