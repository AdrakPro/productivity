<script>
  import TodoList from "$components/todos/TodoList.svelte";
  import DayNavigation from "$components/todos/DayNavigation.svelte";
  import {
    viewMode,
    selectedDateFormatted,
    isToday,
    isPastDate,
  } from "$lib/stores/viewStore.js";

  let todoListRef;

  // Expose method for parent to trigger new task
  export function triggerNewTask() {
    todoListRef?.triggerNewTask?.();
  }
</script>

<div class="h-full flex flex-col">
  <!-- View Title & Navigation -->
  <div class="mb-4">
    {#if $viewMode === "daily"}
      <DayNavigation />
    {:else}
      <h1 class="text-2xl font-bold text-on-surface">Global Tasks</h1>
    {/if}
  </div>

  <!-- Todo List -->
  <TodoList bind:this="{todoListRef}" />
</div>
