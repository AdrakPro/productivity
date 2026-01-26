<script>
  import { Archive, Calendar, Search, X } from "lucide-svelte";
  import {
    archiveDateFrom,
    archiveDateTo,
    archiveSearchMode,
    archiveSearchText,
    archiveSingleDate,
    filteredArchivedTodos,
    openTodoDetail,
    resetFilters,
  } from "$lib/stores/archiveStore.js";
  import ArchivedTodoItem from "$components/todos/ArchivedTodoItem.svelte";
  import TodoDetailDialog from "$components/todos/TodoDetailDialog.svelte";
</script>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="mb-4">
    <h1 class="text-2xl font-bold text-on-surface flex items-center gap-2">
      <Archive size="{28}" />
      Archived Tasks
    </h1>
    <p class="text-gray-400 text-sm mt-1">
      View your completed tasks • {$filteredArchivedTodos.length} total
    </p>
  </div>

  <!-- Search & Filter Section -->
  <div class="card mb-4 space-y-4">
    <!-- Text Search -->
    <div class="relative">
      <Search
        size="{18}"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
        type="text"
        placeholder="Search archived tasks..."
        class="input w-full pl-10"
        bind:value="{$archiveSearchText}"
      />
    </div>

    <!-- Date Filter Mode -->
    <div class="flex items-center gap-4 flex-wrap">
      <span class="text-sm text-gray-400">Filter by date:</span>
      <div class="flex gap-2">
        <button
          class="btn text-sm {$archiveSearchMode === 'all'
            ? 'btn-primary'
            : 'btn-ghost'}"
          on:click="{() => archiveSearchMode.set('all')}"
        >
          All
        </button>
        <button
          class="btn text-sm {$archiveSearchMode === 'single'
            ? 'btn-primary'
            : 'btn-ghost'}"
          on:click="{() => archiveSearchMode.set('single')}"
        >
          Single Date
        </button>
        <button
          class="btn text-sm {$archiveSearchMode === 'range'
            ? 'btn-primary'
            : 'btn-ghost'}"
          on:click="{() => archiveSearchMode.set('range')}"
        >
          Date Range
        </button>
      </div>
    </div>

    <!-- Date Inputs -->
    {#if $archiveSearchMode === "single"}
      <div class="flex items-center gap-3">
        <Calendar size="{18}" class="text-gray-500" />
        <input type="date" class="input" bind:value="{$archiveSingleDate}" />
      </div>
    {:else if $archiveSearchMode === "range"}
      <div class="flex items-center gap-3 flex-wrap">
        <Calendar size="{18}" class="text-gray-500" />
        <input
          type="date"
          class="input"
          placeholder="From"
          bind:value="{$archiveDateFrom}"
        />
        <span class="text-gray-500">to</span>
        <input
          type="date"
          class="input"
          placeholder="To"
          bind:value="{$archiveDateTo}"
        />
      </div>
    {/if}

    <!-- Reset Filters -->
    {#if $archiveSearchMode !== "all" || $archiveSearchText}
      <button
        class="btn btn-ghost text-sm flex items-center gap-2 text-error"
        on:click="{resetFilters}"
      >
        <X size="{16}" />
        Reset Filters
      </button>
    {/if}
  </div>

  <!-- Archived Tasks List -->
  <div class="flex-1 overflow-auto space-y-2">
    {#if $filteredArchivedTodos.length === 0}
      <div class="card text-center py-12">
        <Archive size="{48}" class="mx-auto text-gray-600 mb-4" />
        <p class="text-gray-400">No archived tasks found</p>
        {#if $archiveSearchMode !== "all" || $archiveSearchText}
          <p class="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
        {/if}
      </div>
    {:else}
      {#each $filteredArchivedTodos as todo (todo.id)}
        <ArchivedTodoItem {todo} on:click="{() => openTodoDetail(todo)}" />
      {/each}
    {/if}
  </div>
</div>

<!-- Detail Dialog -->
<TodoDetailDialog />
