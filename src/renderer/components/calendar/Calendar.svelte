<script>
  import { selectedDate } from "$lib/stores/viewStore.js";
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

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  function prevMonth() {
    currentMonth = new Date(year, month - 1, 1);
  }

  function nextMonth() {
    currentMonth = new Date(year, month + 1, 1);
  }

  function selectDate(dateStr) {
    selectedDate.set(dateStr);
  }

  function isSelected(dateStr) {
    return $selectedDate === dateStr;
  }

  function isTodayDate(dateStr) {
    return dateStr === new Date().toISOString().split("T")[0];
  }
</script>

<div class="p-3">
  <div class="flex items-center justify-between mb-3">
    <button class="btn-ghost p-1 rounded" on:click="{prevMonth}">
      <ChevronLeft size="{18}" />
    </button>
    <span class="font-medium text-sm">
      {currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}
    </span>
    <button class="btn-ghost p-1 rounded" on:click="{nextMonth}">
      <ChevronRight size="{18}" />
    </button>
  </div>

  <div class="grid grid-cols-7 gap-1 mb-2">
    {#each weekDays as day}
      <div class="text-center text-xs text-gray-500 font-medium">{day}</div>
    {/each}
  </div>

  <div class="grid grid-cols-7 gap-1">
    <!-- Empty cells for days before first day of month -->
    {#each Array(firstDayOfWeek) as _}
      <div></div>
    {/each}

    {#each days as { day, dateStr }}
      <button
        class="aspect-square flex items-center justify-center text-xs rounded-full transition-colors
               {isSelected(dateStr)
          ? 'bg-primary text-on-primary'
          : 'hover:bg-surface-lighter'}
               {isTodayDate(dateStr) && !isSelected(dateStr)
          ? 'border border-secondary'
          : ''}"
        on:click="{() => selectDate(dateStr)}"
      >
        {day}
      </button>
    {/each}
  </div>
</div>
