<script>
  import { onMount } from "svelte";
  import FileExplorer from "../fileExplorer/FileExplorer.svelte";
  import Calendar from "../calendar/Calendar.svelte";

  let sidebarWidth = 256; // Default width (w-64 = 16rem = 256px)
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  const MIN_WIDTH = 200;
  const MAX_WIDTH = 400;

  // Load saved width from localStorage
  onMount(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      sidebarWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, parseInt(savedWidth, 10)),
      );
    }
  });

  function startResize(event) {
    isResizing = true;
    startX = event.clientX;
    startWidth = sidebarWidth;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function handleMouseMove(event) {
    if (!isResizing) return;

    const diff = event.clientX - startX;
    const newWidth = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, startWidth + diff),
    );
    sidebarWidth = newWidth;
  }

  function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Save width to localStorage
    localStorage.setItem("sidebarWidth", sidebarWidth.toString());
  }
</script>

<aside
  class="bg-surface-light border-r border-surface-lighter flex flex-col overflow-hidden relative"
  style="width: {sidebarWidth}px"
>
  <!-- File Explorer Section -->
  <div class="flex-1 overflow-auto border-b border-surface-lighter">
    <FileExplorer />
  </div>

  <!-- Calendar Section -->
  <div class="h-80 overflow-auto">
    <Calendar />
  </div>

  <!-- Resize Handle -->
  <div
    class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors
           {isResizing ? 'bg-primary' : ''}"
    on:mousedown="{startResize}"
    role="separator"
    aria-orientation="vertical"
  ></div>
</aside>
