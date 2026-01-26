<script>
  import { streakData } from "$lib/stores/statisticsStore.js";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let currentMonth = new Date();

  $: year = currentMonth.getFullYear();
  $: month = currentMonth.getMonth();
  $: daysInMonth = new Date(year, month + 1, 0).getDate();
  $: firstDayOfWeek = new Date(year, month, 1).getDay();

  $: days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { day, dateStr };
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Convert streak data to a map for easy lookup
  $: streakMap = $streakData.reduce((acc, streak) => {
    acc[streak.date] = streak.completed_count;
    return acc;
  }, {});

  $: todayStr = formatDateToISO(new Date());

  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function prevMonth() {
    currentMonth = new Date(year, month - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(year, month + 1, 1);
  }

  function getActivityLevel(dateStr) {
    const count = streakMap[dateStr] || 0;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  }

  function getActivityColor(level) {
    switch (level) {
      case 0:
        return "bg-surface-lighter";
      case 1:
        return "bg-primary/30";
      case 2:
        return "bg-primary/50";
      case 3:
        return "bg-primary/70";
      case 4:
        return "bg-primary";
      default:
        return "bg-surface-lighter";
    }
  }

  function isToday(dateStr) {
    return dateStr === todayStr;
  }

  function isFuture(dateStr) {
    return dateStr > todayStr;
  }
</script>

<div>
  <!-- Month Navigation -->
  <div class="flex items-center justify-between mb-4">
    <button
      class="p-1 rounded hover:bg-surface-lighter transition-colors"
      on:click="{prevMonth}"
    >
      <ChevronLeft size="{18}" />
    </button>
    <span class="font-medium">
      {currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}
    </span>
    <button
      class="p-1 rounded hover:bg-surface-lighter transition-colors"
      on:click="{nextMonth}"
    >
      <ChevronRight size="{18}" />
    </button>
  </div>

  <!-- Week Days Header -->
  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each weekDays as day}
      <div class="text-center text-xs text-gray-500 font-medium py-1">
        {day}
      </div>
    {/each}
  </div>

  <!-- Days Grid -->
  <div class="grid grid-cols-7 gap-1">
    <!-- Empty cells for days before first day of month -->
    {#each Array(firstDayOfWeek) as _}
      <div></div>
    {/each}

    <!-- Day cells -->
    {#each days as { day, dateStr }}
      {@const level = getActivityLevel(dateStr)}
      {@const count = streakMap[dateStr] || 0}
      <div
        class="aspect-square rounded-sm flex items-center justify-center text-xs relative group cursor-default
               {getActivityColor(level)}
               {isToday(dateStr)
          ? 'ring-2 ring-secondary ring-offset-1 ring-offset-background'
          : ''}
               {isFuture(dateStr) ? 'opacity-30' : ''}"
        title="{dateStr}: {count} completed"
      >
        <span class="{level > 2 ? 'text-on-primary' : 'text-gray-400'}"
          >{day}</span
        >

        <!-- Tooltip -->
        {#if count > 0}
          <div
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-light
                      border border-surface-lighter rounded text-xs whitespace-nowrap opacity-0
                      group-hover:opacity-100 transition-opacity pointer-events-none z-10"
          >
            {count} task{count !== 1 ? "s" : ""} completed
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Legend -->
  <div class="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
    <span>Less</span>
    <div class="flex gap-1">
      <div class="w-3 h-3 rounded-sm bg-surface-lighter"></div>
      <div class="w-3 h-3 rounded-sm bg-primary/30"></div>
      <div class="w-3 h-3 rounded-sm bg-primary/50"></div>
      <div class="w-3 h-3 rounded-sm bg-primary/70"></div>
      <div class="w-3 h-3 rounded-sm bg-primary"></div>
    </div>
    <span>More</span>
  </div>
</div>
