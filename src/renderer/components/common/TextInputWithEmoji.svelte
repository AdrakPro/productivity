<script>
  import { createEventDispatcher } from "svelte";
  import EmojiPicker from "./EmojiPicker.svelte";

  export let value = "";
  export let placeholder = "";
  export let autofocus = false;
  export let inputClass = "";
  export let autoCapitalize = true;

  const dispatch = createEventDispatcher();

  let inputElement;
  let emojiPickerOpen = false;

  function handleEmojiSelect(event) {
    const { emoji } = event.detail;

    if (inputElement) {
      const start = inputElement.selectionStart || value.length;
      const end = inputElement.selectionEnd || value.length;
      value = value.slice(0, start) + emoji + value.slice(end);

      setTimeout(() => {
        inputElement.focus();
        inputElement.setSelectionRange(
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
    if (autoCapitalize) {
      value = capitalizeText(value);
    }
    dispatch("input", { value });
  }

  // Capitalize first letter and after sentence endings (. ! ?)
  function capitalizeText(text) {
    if (!text) return text;

    // Capitalize first character
    let result = text.charAt(0).toUpperCase() + text.slice(1);

    // Capitalize after sentence endings (. ! ?) followed by space
    result = result.replace(
      /([.!?]\s+)([a-z])/g,
      (match, separator, letter) => {
        return separator + letter.toUpperCase();
      },
    );

    return result;
  }
</script>

<div class="flex items-center gap-2">
  <input
    type="text"
    class="input flex-1 {inputClass}"
    {placeholder}
    bind:value
    bind:this="{inputElement}"
    on:keydown="{handleKeydown}"
    on:input="{handleInput}"
    {autofocus}
  />
  <EmojiPicker
    bind:isOpen="{emojiPickerOpen}"
    on:select="{handleEmojiSelect}"
  />
</div>
