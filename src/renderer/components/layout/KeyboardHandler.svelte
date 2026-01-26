<script>
  import { createEventDispatcher } from "svelte";
  import {
    viewMode,
    currentPage,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    isToday,
  } from "$lib/stores/viewStore.js";
  import { success } from "$lib/stores/toastStore.js";

  const dispatch = createEventDispatcher();

  // Track if we're currently handling an event to prevent double-firing
  let isHandling = false;

  function handleKeydown(event) {
    // Prevent double-handling
    if (isHandling) return;

    // Don't handle if user is typing in an input/textarea
    const activeElement = document.activeElement;
    const isTyping =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable);

    // Global shortcuts (work even when typing for some)

    // Ctrl/Cmd + N: New task
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "n") {
      event.preventDefault();
      event.stopPropagation();
      dispatch("newTask");
      return;
    }

    // Ctrl/Cmd + B: Go to today (only in daily view, when not on today)
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "b") {
      event.preventDefault();
      event.stopPropagation();

      if ($viewMode === "daily" && $currentPage === "main") {
        let isTodayValue;
        isToday.subscribe((v) => (isTodayValue = v))();

        if (!isTodayValue) {
          goToToday();
          success("Jumped to today");
        }
      }
      return;
    }

    // Don't process other shortcuts when typing
    if (isTyping) {
      return;
    }

    // Navigation shortcuts (only when not typing)
    if ($viewMode === "daily" && $currentPage === "main") {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        isHandling = true;
        goToPreviousDay();
        setTimeout(() => {
          isHandling = false;
        }, 50);
        return;
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        isHandling = true;
        goToNextDay();
        setTimeout(() => {
          isHandling = false;
        }, 50);
        return;
      }
    }

    // T key: Go to today (alternative, without modifier)
    if (
      event.key.toLowerCase() === "t" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      if ($viewMode === "daily" && $currentPage === "main") {
        event.preventDefault();
        event.stopPropagation();

        let isTodayValue;
        isToday.subscribe((v) => (isTodayValue = v))();

        if (!isTodayValue) {
          goToToday();
          success("Jumped to today");
        }
        return;
      }
    }

    // N key: Quick new task (without modifiers)
    if (
      event.key.toLowerCase() === "n" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      event.stopPropagation();
      dispatch("newTask");
    }
  }
</script>

<svelte:window on:keydown="{handleKeydown}" />
