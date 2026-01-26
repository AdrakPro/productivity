<script>
  import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-svelte";
  import {
    selectedDateFormatted,
    selectedDateShort,
    isToday,
    isPastDate,
    isFutureDate,
    goToPreviousDay,
    goToNextDay,
    goToToday,
  } from "$lib/stores/viewStore.js";
</script>

<div class="flex items-center gap-4">
  <!-- Left: Navigation Arrows + Date (centered) -->
  <div class="flex-1 flex items-center justify-center gap-3">
    <button
      class="p-2 rounded-lg hover:bg-surface-lighter transition-colors"
      on:click="{goToPreviousDay}"
      title="Previous day (←)"
    >
      <ChevronLeft size="{20}" />
    </button>

    <div class="text-center min-w-[200px]">
      <h2 class="text-xl font-bold text-on-surface">
        {#if $isToday}
          Today
        {:else}
          {$selectedDateShort}
        {/if}
      </h2>
      <p class="text-sm text-gray-400">{$selectedDateFormatted}</p>
    </div>

    <button
      class="p-2 rounded-lg hover:bg-surface-lighter transition-colors"
      on:click="{goToNextDay}"
      title="Next day (→)"
    >
      <ChevronRight size="{20}" />
    </button>
  </div>

  {#if !$isToday}
    <button
      class="btn btn-ghost flex items-center gap-2 text-sm flex-shrink-0"
      on:click="{goToToday}"
      title="Go to today (Ctrl+B or T)"
    >
      <CalendarDays size="{16}" />
      Today
      <kbd class="px-1.5 py-0.5 bg-surface-lighter rounded text-xs ml-1">T</kbd>
    </button>
  {/if}
</div>
