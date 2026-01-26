<script>
  import { createEventDispatcher } from "svelte";
  import { Check, X } from "lucide-svelte";
  import TextInputWithEmoji from "$components/common/TextInputWithEmoji.svelte";
  import TextareaWithEmoji from "$components/common/TextareaWithEmoji.svelte";

  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";

  function handleSubmit() {
    if (title.trim()) {
      dispatch("submit", {
        title: title.trim(),
        description: description.trim(),
      });
      title = "";
      description = "";
    }
  }

  function handleCancel() {
    dispatch("cancel");
  }

  function handleTitleKeydown(event) {
    if (event.detail.key === "Escape") {
      handleCancel();
    } else if (event.detail.key === "Enter" && !event.detail.shiftKey) {
      event.detail.preventDefault?.();
      handleSubmit();
    }
  }

  function handleDescKeydown(event) {
    if (event.detail.key === "Escape") {
      handleCancel();
    }
  }
</script>

<div class="card mb-4">
  <div class="space-y-3">
    <TextInputWithEmoji
      bind:value="{title}"
      placeholder="Task title... 📝"
      autofocus="{true}"
      on:keydown="{handleTitleKeydown}"
    />
    <TextareaWithEmoji
      bind:value="{description}"
      placeholder="Description (optional) ✨"
      rows="{2}"
      on:keydown="{handleDescKeydown}"
    />
    <div class="flex gap-2">
      <button
        class="btn btn-primary flex items-center gap-2"
        on:click="{handleSubmit}"
        disabled="{!title.trim()}"
      >
        <Check size="{18}" />
        Add Task
      </button>
      <button
        class="btn btn-ghost flex items-center gap-2"
        on:click="{handleCancel}"
      >
        <X size="{18}" />
        Cancel
      </button>
    </div>
  </div>
</div>
