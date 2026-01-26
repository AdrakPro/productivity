<script>
  import { Plus, CheckCircle2 } from "lucide-svelte";
  import {
    filteredTodos,
    pendingCount,
    addTodo,
  } from "$lib/stores/todoStore.js";
  import { viewMode, selectedDate, isPastDate } from "$lib/stores/viewStore.js";
  import TodoItem from "./TodoItem.svelte";
  import TodoForm from "./TodoForm.svelte";

  let showAddForm = false;

  function handleAddTodo(event) {
    const { title, description, deadline } = event.detail;
    addTodo({
      title,
      description,
      due_date: $viewMode === "global" ? deadline : $selectedDate,
      is_global: $viewMode === "global",
    });
    showAddForm = false;
  }

  function cancelAdd() {
    showAddForm = false;
  }

  $: totalTasks = $filteredTodos.length;
  $: completedTasks = totalTasks - $pendingCount;
  $: allDone = totalTasks > 0 && $pendingCount === 0;
</script>

<div class="flex-1 flex flex-col">
  <!-- Add Todo Button (hide for past dates in daily view) -->
  {#if !($viewMode === "daily" && $isPastDate)}
    {#if showAddForm}
      <TodoForm on:submit="{handleAddTodo}" on:cancel="{cancelAdd}" />
    {:else}
      <button
        class="btn btn-primary flex items-center justify-center gap-2 mb-4"
        on:click="{() => (showAddForm = true)}"
      >
        <Plus size="{20}" />
        Add New Task
      </button>
    {/if}
  {/if}

  <!-- Todo List -->
  <div class="flex-1 overflow-auto space-y-3">
    {#if $filteredTodos.length === 0}
      <div class="card text-center py-12">
        <p class="text-gray-400">
          {#if $viewMode === "daily" && $isPastDate}
            No tasks were recorded for this day
          {:else}
            No tasks yet. Add your first task!
          {/if}
        </p>
      </div>
    {:else}
      {#each $filteredTodos as todo (todo.id)}
        <TodoItem {todo} readonly="{$viewMode === 'daily' && $isPastDate}" />
      {/each}
    {/if}
  </div>

  <!-- Status Footer -->
  {#if totalTasks > 0}
    <div class="mt-4 pt-4 border-t border-surface-lighter">
      {#if allDone}
        <div class="flex items-center justify-center gap-2 text-secondary">
          <CheckCircle2 size="{20}" />
          <span class="font-medium"
            >All {totalTasks} task{totalTasks !== 1 ? "s" : ""} completed! 🎉</span
          >
        </div>
      {:else}
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-400">
            {$pendingCount} task{$pendingCount !== 1 ? "s" : ""} remaining
          </span>
          <span class="text-gray-500">
            {completedTasks}/{totalTasks} done
          </span>
        </div>
        <div class="h-1 bg-surface-lighter rounded-full overflow-hidden mt-2">
          <div
            class="h-full bg-primary transition-all duration-300"
            style="width: {totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0}%"
          ></div>
        </div>
      {/if}
    </div>
  {/if}
</div>
