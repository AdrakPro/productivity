<script>
  import {
    currentPage,
    goToNextDay,
    goToPreviousDay,
    viewMode,
  } from "$lib/stores/viewStore.js";

  function handleKeydown(event) {
    // Only handle if we're in daily view and on main page
    if ($viewMode !== "daily" || $currentPage !== "main") {
      return;
    }

    // Don't handle if user is typing in an input/textarea
    const activeElement = document.activeElement;
    const isTyping =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable);

    if (isTyping) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPreviousDay();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextDay();
    }
  }
</script>

<svelte:window on:keydown="{handleKeydown}" />
