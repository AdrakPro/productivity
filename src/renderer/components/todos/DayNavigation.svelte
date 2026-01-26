<script>
  import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-svelte";
  import {
    goToNextDay,
    goToPreviousDay,
    goToToday,
    isToday,
    selectedDateFormatted,
    selectedDateShort,
  } from "$lib/stores/viewStore.js";
</script>

<div class="flex items-center gap-4">
  <button
    class="btn btn-ghost p-2 rounded-lg hover:bg-surface-lighter group"
    on:click="{goToPreviousDay}"
    title="Previous day (← Arrow Key)"
  >
    <ChevronLeft size="{24}" />
  </button>

  <div class="flex-1 text-center">
    <h1 class="text-2xl font-bold text-on-surface">
      {#if $isToday}
        Today
      {:else}
        {$selectedDateShort}
      {/if}
    </h1>
    <p class="text-sm text-gray-500">{$selectedDateFormatted}</p>
  </div>

  <button
    class="btn btn-ghost p-2 rounded-lg hover:bg-surface-lighter group"
    on:click="{goToNextDay}"
    title="Next day (→ Arrow Key)"
  >
    <ChevronRight size="{24}" />
  </button>

  {#if !$isToday}
    <button
      class="btn btn-secondary flex items-center gap-2"
      on:click="{goToToday}"
      title="Go to today"
    >
      <CalendarDays size="{18}" />
      <span>Today</span>
    </button>
  {/if}
</div>
