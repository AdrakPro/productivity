<script>
  import FileExplorer from "../fileExplorer/FileExplorer.svelte";
  import Calendar from "../calendar/Calendar.svelte";
</script>

<aside
  class="w-64 bg-surface-light border-r border-surface-lighter flex flex-col overflow-hidden"
>
  <!-- File Explorer Section -->
  <div class="flex-1 overflow-auto border-b border-surface-lighter">
    <FileExplorer />
  </div>

  <!-- Calendar Section -->
  <div class="h-72 overflow-auto">
    <Calendar />
  </div>
</aside>
