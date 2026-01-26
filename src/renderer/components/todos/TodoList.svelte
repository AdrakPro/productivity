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
  let todoFormRef;

  // Expose method to trigger new task
  export function triggerNewTask() {
    // Check if we can add tasks (not past date in daily view)
    const canAdd = !($viewMode === "daily" && $isPastDate);
    if (canAdd) {
      showAddForm = true;
      // Focus the form after it renders
      setTimeout(() => {
        todoFormRef?.focus?.();
      }, 50);
    }
  }

  function handleAddTodo(event) {
    const { title, description, deadline, priority } = event.detail;
    addTodo({
      title,
      description,
      due_date: $viewMode === "global" ? deadline : $selectedDate,
      is_global: $viewMode === "global",
      priority: priority || "none",
    });
    showAddForm = false;
  }

  function cancelAdd() {
    showAddForm = false;
  }

  $: totalTasks = $filteredTodos.length;
  $: completedTasks = totalTasks - $pendingCount;
  $: allDone = totalTasks > 0 && $pendingCount === 0;
  $: canAddTasks = !($viewMode === "daily" && $isPastDate);
</script>

<div class="flex-1 flex flex-col">
  <!-- Add Todo Section -->
  {#if canAddTasks}
    {#if showAddForm}
      <TodoForm
        bind:this="{todoFormRef}"
        on:submit="{handleAddTodo}"
        on:cancel="{cancelAdd}"
      />
    {:else}
      <button
        class="btn btn-primary flex items-center justify-center gap-2 mb-4"
        on:click="{() => (showAddForm = true)}"
      >
        <Plus size="{20}" />
        Add New Task
        <kbd class="ml-2 px-1.5 py-0.5 bg-primary-variant/50 rounded text-xs"
          >N</kbd
        >
      </button>
    {/if}
  {/if}

  <!-- Todo List -->
  <div class="flex-1 overflow-auto space-y-3">
    {#if $filteredTodos.length === 0}
      <div class="card text-center py-12 animate-fadeIn">
        <p class="text-gray-400">
          {#if $viewMode === "daily" && $isPastDate}
            No tasks were recorded for this day
          {:else}
            No tasks yet. Press <kbd
              class="px-1.5 py-0.5 bg-surface-lighter rounded text-xs">N</kbd
            > to add your first task!
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
        <div
          class="flex items-center justify-center gap-2 text-secondary animate-fadeIn"
        >
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
            class="h-full bg-primary transition-all duration-500"
            style="width: {totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0}%"
          ></div>
        </div>
      {/if}
    </div>
  {/if}
</div>
