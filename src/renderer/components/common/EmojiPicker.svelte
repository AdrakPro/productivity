<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Smile } from "lucide-svelte";
  import Portal from "./Portal.svelte";

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  let buttonRef;
  let dropdownStyle = "";

  const emojiCategories = [
    {
      name: "Smileys",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "😉",
        "😍",
        "🥰",
        "😘",
        "😎",
        "🤩",
        "🥳",
        "😏",
        "😌",
        "😴",
      ],
    },
    {
      name: "Gestures",
      emojis: [
        "👍",
        "👎",
        "👌",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "👏",
        "🙌",
        "👐",
        "🤲",
        "🙏",
        "💪",
        "🦾",
        "✍️",
        "🤳",
        "💅",
      ],
    },
    {
      name: "Objects",
      emojis: [
        "⭐",
        "🌟",
        "✨",
        "💫",
        "🔥",
        "💥",
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "💯",
        "✅",
        "❌",
        "⚡",
        "💡",
        "📌",
      ],
    },
    {
      name: "Activities",
      emojis: [
        "🎯",
        "🎮",
        "🎨",
        "🎬",
        "🎤",
        "🎧",
        "📚",
        "📝",
        "💻",
        "📱",
        "⌚",
        "📷",
        "🔑",
        "🏠",
        "🚀",
        "✈️",
        "🎁",
        "🏆",
        "🥇",
        "🎉",
      ],
    },
  ];

  function selectEmoji(emoji) {
    dispatch("select", { emoji });
    isOpen = false;
  }

  function handleClickOutside(event) {
    if (isOpen && buttonRef && !buttonRef.contains(event.target)) {
      const dropdown = document.querySelector(".emoji-dropdown-portal");
      if (dropdown && dropdown.contains(event.target)) {
        return;
      }
      isOpen = false;
    }
  }

  async function togglePicker(event) {
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
    const dropdownHeight = 280;
    const dropdownWidth = 280;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top, left;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      top = rect.top - dropdownHeight - 4;
    } else {
      top = rect.bottom + 4;
    }

    left = rect.right - dropdownWidth;
    if (left < 8) {
      left = rect.left;
    }
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

<div class="emoji-picker-container">
  <button
    bind:this="{buttonRef}"
    type="button"
    class="emoji-button"
    on:click="{togglePicker}"
    title="Add emoji"
  >
    <Smile size="{18}" />
  </button>
</div>

{#if isOpen}
  <Portal>
    <div
      class="emoji-dropdown-portal"
      style="{dropdownStyle}"
      on:click|stopPropagation
    >
      {#each emojiCategories as category}
        <div class="emoji-category">
          <span class="category-name">{category.name}</span>
          <div class="emoji-grid">
            {#each category.emojis as emoji}
              <button
                type="button"
                class="emoji-item"
                on:click|stopPropagation="{() => selectEmoji(emoji)}"
              >
                {emoji}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </Portal>
{/if}

<style>
  .emoji-picker-container {
    position: relative;
    display: inline-block;
  }

  .emoji-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
  }

  .emoji-button:hover {
    background-color: #2d2d2d;
    color: #ffffff;
  }

  :global(.emoji-dropdown-portal) {
    position: fixed;
    width: 280px;
    max-height: 280px;
    background-color: #1e1e1e;
    border: 1px solid #3d3d3d;
    border-radius: 8px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
    z-index: 99999;
    overflow-y: auto;
    padding: 8px;
    animation: portalFadeIn 0.15s ease-out;
  }

  :global(.emoji-dropdown-portal .emoji-category) {
    margin-bottom: 8px;
  }

  :global(.emoji-dropdown-portal .emoji-category:last-child) {
    margin-bottom: 0;
  }

  :global(.emoji-dropdown-portal .category-name) {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    padding-left: 4px;
  }

  :global(.emoji-dropdown-portal .emoji-grid) {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 2px;
  }

  :global(.emoji-dropdown-portal .emoji-item) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 16px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  :global(.emoji-dropdown-portal .emoji-item:hover) {
    background-color: #2d2d2d;
  }

  :global(.emoji-dropdown-portal::-webkit-scrollbar) {
    width: 6px;
  }

  :global(.emoji-dropdown-portal::-webkit-scrollbar-track) {
    background: #1e1e1e;
  }

  :global(.emoji-dropdown-portal::-webkit-scrollbar-thumb) {
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
