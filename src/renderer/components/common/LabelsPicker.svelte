<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Tag, ChevronDown } from "lucide-svelte";
  import { defaultLabels } from "$lib/stores/priorityStore.js";
  import LabelIcon from "./LabelIcon.svelte";
  import Portal from "./Portal.svelte";

  export let value = [];
  export let compact = false;

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let buttonRef;
  let dropdownStyle = "";

  $: selectedLabels = value
    .map((id) => defaultLabels.find((l) => l.id === id))
    .filter(Boolean);

  function toggleLabel(labelId) {
    if (value.includes(labelId)) {
      value = value.filter((id) => id !== labelId);
    } else {
      value = [...value, labelId];
    }
    dispatch("change", { labels: value });
  }

  function handleClickOutside(event) {
    if (isOpen && buttonRef && !buttonRef.contains(event.target)) {
      const dropdown = document.querySelector(".labels-dropdown-portal");
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
    const dropdownHeight = 320;
    const dropdownWidth = 220;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top, left;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - Math.min(dropdownHeight, spaceAbove - 8) - 4;
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

<div class="labels-picker-container">
  <button
    bind:this="{buttonRef}"
    type="button"
    class="picker-button"
    on:click="{toggleDropdown}"
  >
    <Tag size="{14}" class="text-gray-500" />

    {#if !compact}
      {#if selectedLabels.length === 0}
        <span class="text-gray-400">No labels</span>
      {:else}
        <div class="selected-labels">
          {#each selectedLabels.slice(0, 2) as label}
            <span class="label-badge {label.color}">
              <LabelIcon icon="{label.icon}" size="{10}" />
              {label.label}
            </span>
          {/each}
          {#if selectedLabels.length > 2}
            <span class="more-count">+{selectedLabels.length - 2}</span>
          {/if}
        </div>
      {/if}
      <ChevronDown size="{14}" class="text-gray-500" />
    {:else if selectedLabels.length > 0}
      <span class="more-count">{selectedLabels.length}</span>
    {/if}
  </button>
</div>

{#if isOpen}
  <Portal>
    <div
      class="labels-dropdown-portal"
      style="{dropdownStyle}"
      on:click|stopPropagation
    >
      <div class="dropdown-list">
        {#each defaultLabels as label}
          <button
            type="button"
            class="dropdown-item"
            on:click|stopPropagation="{() => toggleLabel(label.id)}"
          >
            <span class="label-icon {label.color}">
              <LabelIcon icon="{label.icon}" size="{12}" />
            </span>
            <span class="label-name">{label.label}</span>
            {#if value.includes(label.id)}
              <span class="checkmark">✓</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </Portal>
{/if}

<style>
  .labels-picker-container {
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

  .selected-labels {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .label-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    color: white;
  }

  .more-count {
    font-size: 12px;
    color: #9ca3af;
  }

  /* Portal dropdown styles - must be global */
  :global(.labels-dropdown-portal) {
    position: fixed;
    min-width: 200px;
    max-width: 260px;
    max-height: 320px;
    background-color: #1e1e1e;
    border: 1px solid #3d3d3d;
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
    z-index: 99999;
    overflow: hidden;
    animation: portalFadeIn 0.15s ease-out;
  }

  :global(.labels-dropdown-portal .dropdown-header) {
    padding: 10px 12px;
    border-bottom: 1px solid #2d2d2d;
    background-color: #1e1e1e;
    font-size: 11px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.labels-dropdown-portal .dropdown-list) {
    max-height: 260px;
    overflow-y: auto;
    padding: 4px 0;
  }

  :global(.labels-dropdown-portal .dropdown-item) {
    display: flex;
    align-items: center;
    gap: 10px;
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

  :global(.labels-dropdown-portal .dropdown-item:hover) {
    background-color: #2d2d2d;
  }

  :global(.labels-dropdown-portal .label-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    color: white;
    flex-shrink: 0;
  }

  :global(.labels-dropdown-portal .label-name) {
    flex: 1;
  }

  :global(.labels-dropdown-portal .checkmark) {
    color: #bb86fc;
    font-weight: bold;
  }

  :global(.labels-dropdown-portal .dropdown-list::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.labels-dropdown-portal .dropdown-list::-webkit-scrollbar-track) {
    background: #1e1e1e;
  }

  :global(.labels-dropdown-portal .dropdown-list::-webkit-scrollbar-thumb) {
    background-color: #3d3d3d;
    border-radius: 3px;
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
