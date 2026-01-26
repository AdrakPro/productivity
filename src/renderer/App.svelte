<script>
  import { onDestroy, onMount } from "svelte";
  import Sidebar from "./components/layout/Sidebar.svelte";
  import Header from "./components/layout/Header.svelte";
  import KeyboardHandler from "./components/layout/KeyboardHandler.svelte";
  import MainView from "./views/MainView.svelte";
  import ArchiveView from "./views/ArchiveView.svelte";
  import StatisticsView from "./views/StatisticsView.svelte";
  import { currentPage } from "$lib/stores/viewStore.js";
  import { todos } from "$lib/stores/todoStore.js";
  import {
    archivePastTodos,
    startAutoArchiveService,
    stopAutoArchiveService,
  } from "$lib/services/autoArchiveService.js";

  onMount(() => {
    // Load mock data for demonstration (will be replaced with DB in Phase 2)
    todos.set([
      {
        id: 1,
        title: "Complete project setup 🚀",
        description: "Initialize Electron + Svelte project ⚡",
        due_date: new Date().toISOString().split("T")[0],
        is_global: false,
        is_completed: false,
        is_archived: false,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtasks: [
          {
            id: 101,
            todo_id: 1,
            title: "Install dependencies 📦",
            is_completed: true,
            sort_order: 0,
          },
          {
            id: 102,
            todo_id: 1,
            title: "Configure Vite ⚙️",
            is_completed: true,
            sort_order: 1,
          },
          {
            id: 103,
            todo_id: 1,
            title: "Setup Tailwind CSS 🎨",
            is_completed: false,
            sort_order: 2,
          },
        ],
      },
      {
        id: 2,
        title: "Design database schema 🗄️",
        description: "Create tables for todos and subtasks",
        due_date: null,
        is_global: true,
        is_completed: false,
        is_archived: false,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtasks: [
          {
            id: 201,
            todo_id: 2,
            title: "Define todos table ✏️",
            is_completed: false,
            sort_order: 0,
          },
          {
            id: 202,
            todo_id: 2,
            title: "Define subtasks table 📝",
            is_completed: false,
            sort_order: 1,
          },
        ],
      },
    ]);

    // Archive any past todos that weren't archived
    archivePastTodos();

    // Start auto-archive service
    startAutoArchiveService();
  });

  onDestroy(() => {
    stopAutoArchiveService();
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
