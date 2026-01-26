<script>
  import { createEventDispatcher } from "svelte";
  import { Smile } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let isOpen = false;

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
        "😌",
        "😍",
        "🥰",
        "😘",
        "😎",
        "🤩",
        "🥳",
        "😏",
        "😢",
        "😭",
        "😤",
        "😡",
        "🤔",
        "🤫",
        "🤭",
        "🙄",
        "😴",
        "🤯",
        "🥺",
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
        "🤙",
        "👈",
        "👉",
        "👆",
        "👇",
        "☝️",
        "✋",
        "🤚",
        "🖐️",
        "🖖",
        "👋",
        "🤝",
        "👏",
        "🙌",
        "👐",
        "🤲",
        "🙏",
        "✍️",
        "💪",
        "🦾",
        "🦿",
      ],
    },
    {
      name: "Objects",
      emojis: [
        "📝",
        "📋",
        "📌",
        "📍",
        "📎",
        "🔗",
        "📐",
        "📏",
        "✂️",
        "🗃️",
        "🗄️",
        "🗑️",
        "🔒",
        "🔓",
        "🔑",
        "🔨",
        "🪓",
        "⛏️",
        "⚒️",
        "🛠️",
        "🔧",
        "🔩",
        "⚙️",
        "🧱",
        "💡",
        "🔦",
        "🕯️",
        "🪔",
      ],
    },
    {
      name: "Symbols",
      emojis: [
        "✅",
        "❌",
        "❓",
        "❗",
        "💯",
        "🔥",
        "⭐",
        "🌟",
        "✨",
        "💫",
        "💥",
        "💢",
        "💦",
        "💨",
        "🕳️",
        "💣",
        "💬",
        "👁️‍🗨️",
        "🗨️",
        "🗯️",
        "💭",
        "💤",
        "🎯",
        "🏆",
        "🥇",
        "🥈",
        "🥉",
        "🏅",
      ],
    },
    {
      name: "Time",
      emojis: [
        "📅",
        "📆",
        "🗓️",
        "📇",
        "⏰",
        "⏱️",
        "⏲️",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
        "🕛",
        "⌛",
        "⏳",
        "🔔",
        "🔕",
        "📣",
        "📢",
      ],
    },
    {
      name: "Work",
      emojis: [
        "💼",
        "📁",
        "📂",
        "🗂️",
        "📊",
        "📈",
        "📉",
        "📃",
        "📄",
        "📑",
        "🗒️",
        "🗓️",
        "📓",
        "📔",
        "📒",
        "📕",
        "📗",
        "📘",
        "📙",
        "📚",
        "📖",
        "🔖",
        "🏷️",
        "💰",
        "💵",
        "💸",
        "📧",
        "📨",
      ],
    },
    {
      name: "Tech",
      emojis: [
        "💻",
        "🖥️",
        "🖨️",
        "⌨️",
        "🖱️",
        "🖲️",
        "💾",
        "💿",
        "📀",
        "📱",
        "📲",
        "☎️",
        "📞",
        "📟",
        "📠",
        "🔋",
        "🔌",
        "🌐",
        "📡",
        "🛰️",
        "🚀",
        "⚡",
        "🔮",
        "🧿",
        "🎮",
        "🕹️",
        "🤖",
        "👾",
      ],
    },
  ];

  let activeCategory = emojiCategories[0].name;
  let buttonElement;
  let horizontalPosition = "left-0"; // 'left-0' or 'right-0'

  function selectEmoji(emoji) {
    dispatch("select", { emoji });
    isOpen = false;
  }

  function togglePicker() {
    isOpen = !isOpen;
    if (isOpen) {
      // Wait for next tick to calculate position
      setTimeout(calculatePosition, 0);
    }
  }

  function calculatePosition() {
    if (!buttonElement) return;

    const buttonRect = buttonElement.getBoundingClientRect();
    const pickerWidth = 320;
    const viewportWidth = window.innerWidth;
    const spaceOnRight = viewportWidth - buttonRect.left;

    if (spaceOnRight < pickerWidth + 16) {
      horizontalPosition = "right-0";
    } else {
      horizontalPosition = "left-0";
    }
  }

  function handleClickOutside(event) {
    if (isOpen && !event.target.closest(".emoji-picker-container")) {
      isOpen = false;
    }
  }

  function handleResize() {
    if (isOpen) {
      calculatePosition();
    }
  }
</script>

<svelte:window on:click="{handleClickOutside}" on:resize="{handleResize}" />

<div class="emoji-picker-container relative inline-block">
  <button
    type="button"
    bind:this="{buttonElement}"
    class="p-2 rounded hover:bg-surface-lighter text-gray-500 hover:text-primary transition-colors"
    on:click|stopPropagation="{togglePicker}"
    title="Add emoji"
  >
    <Smile size="{18}" />
  </button>

  {#if isOpen}
    <div
      class="absolute top-full mt-2 bg-surface-light border border-surface-lighter rounded-lg shadow-xl z-50 w-80 {horizontalPosition}"
      on:click|stopPropagation
    >
      <div
        class="flex overflow-x-auto border-b border-surface-lighter p-1 gap-1 scrollbar-thin"
      >
        {#each emojiCategories as category}
          <button
            type="button"
            class="px-2 py-1 text-xs rounded whitespace-nowrap transition-colors
                   {activeCategory === category.name
              ? 'bg-primary text-on-primary'
              : 'text-gray-400 hover:bg-surface-lighter'}"
            on:click="{() => (activeCategory = category.name)}"
          >
            {category.name}
          </button>
        {/each}
      </div>

      <div class="p-2 max-h-48 overflow-y-auto">
        {#each emojiCategories.filter((c) => c.name === activeCategory) as category}
          <div class="grid grid-cols-8 gap-1">
            {#each category.emojis as emoji}
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-surface-lighter transition-colors"
                on:click="{() => selectEmoji(emoji)}"
              >
                {emoji}
              </button>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thin::-webkit-scrollbar {
    height: 4px;
  }
</style>
