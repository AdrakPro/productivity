<script>
  import { Calendar, CheckCircle2, Globe } from "lucide-svelte";
  import { getTodoProgress } from "$lib/stores/todoStore.js";

  export let todo;

  // Format date for display (DD.MM.YYYY)
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr.split("T")[0] + "T00:00:00");
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  }

  $: displayDate = todo.is_global
    ? `Global deadline ${formatDate(todo.due_date)}`
    : `Daily ${formatDate(todo.due_date)}`;

  $: progress = getTodoProgress(todo);
  $: hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
</script>

<button
  class="w-full card hover:bg-surface-lighter transition-colors cursor-pointer text-left group"
  on:click
>
  <span class="flex items-center justify-between">
    <span class="flex items-center gap-3 min-w-0">
      {#if todo.is_global}
        <Globe size="{16}" class="text-secondary flex-shrink-0" />
      {:else}
        <Calendar size="{16}" class="text-primary flex-shrink-0" />
      {/if}

      <span class="text-on-surface truncate">{todo.title}</span>

      {#if hasSubtasks}
        <span class="text-xs text-gray-500 flex items-center gap-1">
          <CheckCircle2 size="{12}" />
          {progress.completed}/{progress.total}
        </span>
      {/if}
    </span>

    <span
      class="text-sm text-gray-500 group-hover:text-gray-400 flex-shrink-0 ml-4"
    >
      {displayDate}
    </span>
  </span>
</button>
