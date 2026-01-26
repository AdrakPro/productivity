<script>
  import TodoList from "$components/todos/TodoList.svelte";
  import DayNavigation from "$components/todos/DayNavigation.svelte";
  import { viewMode, } from "$lib/stores/viewStore.js";
</script>

<div class="h-full flex flex-col">
  <!-- View Title & Navigation -->
  <div class="mb-4">
    {#if $viewMode === "daily"}
      <!-- Day Navigation for Daily View -->
      <DayNavigation />
    {:else}
      <h1 class="text-2xl font-bold text-on-surface">Global Tasks</h1>
      <p class="text-gray-400 text-sm mt-1">
        Tasks with deadlines, not tied to specific days
      </p>
    {/if}
  </div>

  <!-- Todo List -->
  <TodoList />
</div>
