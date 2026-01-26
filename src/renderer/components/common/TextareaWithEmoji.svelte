<script>
  import { createEventDispatcher } from "svelte";
  import EmojiPicker from "./EmojiPicker.svelte";

  export let value = "";
  export let placeholder = "";
  export let rows = 2;
  export let textareaClass = "";
  export let autoCapitalize = true;

  const dispatch = createEventDispatcher();

  let textareaElement;
  let emojiPickerOpen = false;

  function handleEmojiSelect(event) {
    const { emoji } = event.detail;

    if (textareaElement) {
      const start = textareaElement.selectionStart || value.length;
      const end = textareaElement.selectionEnd || value.length;
      value = value.slice(0, start) + emoji + value.slice(end);

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

    if (autoCapitalize) {
      value = capitalizeText(value);
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

  function capitalizeText(text) {
    if (!text) return text;

    let result = text.charAt(0).toUpperCase() + text.slice(1);

    result = result.replace(
      /([.!?]\s+)([a-z])/g,
      (match, separator, letter) => {
        return separator + letter.toUpperCase();
      },
    );

    result = result.replace(/(\n\s*)([a-z])/g, (match, separator, letter) => {
      return separator + letter.toUpperCase();
    });

    return result;
  }
</script>

<div class="relative">
  <div class="flex gap-2">
    <textarea
      class="input w-full resize-none {textareaClass}"
      {placeholder}
      {rows}
      bind:value
      bind:this="{textareaElement}"
      on:keydown="{handleKeydown}"
      on:input="{handleInput}"
    ></textarea>
    <div class="flex-shrink-0">
      <EmojiPicker
        bind:isOpen="{emojiPickerOpen}"
        on:select="{handleEmojiSelect}"
      />
    </div>
  </div>
</div>
