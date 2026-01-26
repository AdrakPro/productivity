<script>
  import { createEventDispatcher } from "svelte";
  import { Check, X, Calendar } from "lucide-svelte";
  import TextInputWithEmoji from "$components/common/TextInputWithEmoji.svelte";
  import TextareaWithEmoji from "$components/common/TextareaWithEmoji.svelte";
  import { viewMode } from "$lib/stores/viewStore.js";

  const dispatch = createEventDispatcher();

  let title = "";
  let description = "";
  let deadline = "";

  function handleSubmit() {
    if (title.trim()) {
      dispatch("submit", {
        title: title.trim(),
        description: description.trim(),
        deadline: $viewMode === "global" ? deadline || null : null,
      });
      title = "";
      description = "";
      deadline = "";
    }
  }

  function handleCancel() {
    dispatch("cancel");
  }

  function handleTitleKeydown(event) {
    if (event.detail?.key === "Escape" || event.key === "Escape") {
      handleCancel();
    } else if (
      (event.detail?.key === "Enter" || event.key === "Enter") &&
      !event.shiftKey
    ) {
      event.preventDefault?.();
      handleSubmit();
    }
  }

  function handleDescKeydown(event) {
    if (event.detail?.key === "Escape" || event.key === "Escape") {
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

    <!-- Deadline picker for global tasks (inline, no checkbox) -->
    {#if $viewMode === "global"}
      <div class="flex items-center gap-2">
        <Calendar size="{16}" class="text-gray-500 flex-shrink-0" />
        <span class="text-sm text-gray-400">Deadline</span>
        <input
          type="date"
          class="input text-sm py-1"
          bind:value="{deadline}"
          placeholder="Optional"
        />
        {#if deadline}
          <button
            type="button"
            class="text-gray-500 hover:text-error p-1 rounded hover:bg-surface-lighter"
            on:click="{() => (deadline = '')}"
            title="Clear deadline"
          >
            <X size="{14}" />
          </button>
        {:else}
          <span class="text-xs text-gray-500">(optional)</span>
        {/if}
      </div>
    {/if}

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
