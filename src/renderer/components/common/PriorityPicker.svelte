<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Flag, ChevronDown } from "lucide-svelte";
  import { priorities, getPriorityById } from "$lib/stores/priorityStore.js";
  import Portal from "./Portal.svelte";

  export let value = "none";
  export let compact = false;

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let buttonRef;
  let dropdownStyle = "";

  $: selectedPriority = getPriorityById(value);

  function selectPriority(priorityId) {
    value = priorityId;
    dispatch("change", { priority: priorityId });
    isOpen = false;
  }

  function handleClickOutside(event) {
    if (isOpen && buttonRef && !buttonRef.contains(event.target)) {
      // Check if click is inside dropdown
      const dropdown = document.querySelector(".priority-dropdown-portal");
      if (dropdown && dropdown.contains(event.target)) {
        return;
      }
      isOpen = false;
    }
  }

  async function toggleDropdown(event) {
    event.stopPropagation();
    isOpen = !isOpen;

    if (isOpen) {
      await tick();
      positionDropdown();
    }
  }

  function positionDropdown() {
    if (!buttonRef) return;

    const rect = buttonRef.getBoundingClientRect();
    const dropdownHeight = 200;
    const dropdownWidth = 150;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top, left;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - 4;
    } else {
      top = rect.bottom + 4;
    }

    left = rect.left;
    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 8;
    }

    dropdownStyle = `top: ${Math.max(4, top)}px; left: ${Math.max(4, left)}px;`;
  }

  function handleScrollOrResize() {
    if (isOpen) {
      positionDropdown();
    }
  }
</script>

<svelte:window
  on:click="{handleClickOutside}"
  on:scroll|capture="{handleScrollOrResize}"
  on:resize="{handleScrollOrResize}"
/>

<div class="priority-picker-container">
  <button
    bind:this="{buttonRef}"
    type="button"
    class="picker-button"
    on:click="{toggleDropdown}"
  >
    {#if selectedPriority.color}
      <span class="priority-dot {selectedPriority.color}"></span>
    {:else}
      <Flag size="{14}" class="text-gray-500" />
    {/if}

    {#if !compact}
      <span class="{selectedPriority.textColor || 'text-gray-400'}">
        {selectedPriority.label}
      </span>
      <ChevronDown size="{14}" class="text-gray-500" />
    {/if}
  </button>
</div>

{#if isOpen}
  <Portal>
    <div
      class="priority-dropdown-portal"
      style="{dropdownStyle}"
      on:click|stopPropagation
    >
      {#each priorities as priority}
        <button
          type="button"
          class="dropdown-item {value === priority.id ? 'selected' : ''}"
          on:click|stopPropagation="{() => selectPriority(priority.id)}"
        >
          {#if priority.color}
            <span class="priority-dot {priority.color}"></span>
          {:else}
            <span class="priority-dot bg-gray-500"></span>
          {/if}
          <span class="{priority.textColor || 'text-gray-400'}"
            >{priority.label}</span
          >
        </button>
      {/each}
    </div>
  </Portal>
{/if}

<style>
  .priority-picker-container {
    position: relative;
    display: inline-block;
  }

  .picker-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    border: 1px solid #2d2d2d;
    background: transparent;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.15s;
    color: inherit;
  }

  .picker-button:hover {
    background-color: #2d2d2d;
  }

  .priority-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  :global(.priority-dropdown-portal) {
    position: fixed;
    min-width: 150px;
    background-color: #1e1e1e;
    border: 1px solid #3d3d3d;
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
    z-index: 99999;
    overflow: hidden;
    padding: 4px 0;
    animation: portalFadeIn 0.15s ease-out;
  }

  :global(.priority-dropdown-portal .dropdown-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    text-align: left;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  :global(.priority-dropdown-portal .dropdown-item:hover) {
    background-color: #2d2d2d;
  }

  :global(.priority-dropdown-portal .dropdown-item.selected) {
    background-color: #2d2d2d;
  }

  :global(.priority-dropdown-portal .priority-dot) {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @keyframes -global-portalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
