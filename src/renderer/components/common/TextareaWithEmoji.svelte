<script>
  import { createEventDispatcher } from "svelte";
  import EmojiPicker from "./EmojiPicker.svelte";

  export let value = "";
  export let placeholder = "";
  export let rows = 2;
  export let textareaClass = "";

  const dispatch = createEventDispatcher();

  let textareaElement;
  let emojiPickerOpen = false;

  function handleEmojiSelect(event) {
    const { emoji } = event.detail;

    // Insert emoji at cursor position
    if (textareaElement) {
      const start = textareaElement.selectionStart || value.length;
      const end = textareaElement.selectionEnd || value.length;
      value = value.slice(0, start) + emoji + value.slice(end);

      // Set cursor position after emoji
      setTimeout(() => {
        textareaElement.focus();
        textareaElement.setSelectionRange(
          start + emoji.length,
          start + emoji.length,
        );
      }, 0);
    } else {
      value += emoji;
    }

    dispatch("input", { value });
  }

  function handleKeydown(event) {
    dispatch("keydown", event);
  }

  function handleInput() {
    dispatch("input", { value });
  }
</script>

<div class="space-y-2">
  <textarea
    class="input w-full resize-none {textareaClass}"
    {placeholder}
    {rows}
    bind:value
    bind:this="{textareaElement}"
    on:keydown="{handleKeydown}"
    on:input="{handleInput}"
  ></textarea>
  <div class="flex justify-end">
    <EmojiPicker
      bind:isOpen="{emojiPickerOpen}"
      on:select="{handleEmojiSelect}"
    />
  </div>
</div>
