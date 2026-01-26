<script>
  import { createEventDispatcher } from "svelte";
  import { Check, Edit3, Trash2, X } from "lucide-svelte";
  import TextInputWithEmoji from "$components/common/TextInputWithEmoji.svelte";

  export let subtask;
  export let readonly = false;

  const dispatch = createEventDispatcher();

  let isEditing = false;
  let editTitle = subtask.title;

  function toggleCompleted() {
    dispatch("toggle", {
      subtaskId: subtask.id,
      isCompleted: !subtask.is_completed,
    });
  }

  function handleDelete() {
    dispatch("delete", { subtaskId: subtask.id });
  }

  function startEdit() {
    editTitle = subtask.title;
    isEditing = true;
  }

  function saveEdit() {
    if (editTitle.trim()) {
      dispatch("edit", {
        subtaskId: subtask.id,
        title: editTitle.trim(),
      });
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
  }

  function handleKeydown(event) {
    const key = event.detail?.key || event.key;
    if (key === "Enter") {
      saveEdit();
    } else if (key === "Escape") {
      cancelEdit();
    }
  }
</script>

<div class="flex items-center gap-2 group py-1">
  <button
    class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0
           {subtask.is_completed
      ? 'bg-primary border-primary'
      : 'border-gray-500 hover:border-primary'}"
    on:click="{toggleCompleted}"
    disabled="{readonly}"
  >
    {#if subtask.is_completed}
      <Check size="{12}" class="text-on-primary" />
    {/if}
  </button>

  {#if isEditing && !readonly}
    <div class="flex-1 flex items-center gap-2">
      <TextInputWithEmoji
        bind:value="{editTitle}"
        placeholder="Subtask title..."
        autofocus="{true}"
        inputClass="text-sm py-1"
        on:keydown="{handleKeydown}"
      />
      <button
        class="p-1 rounded hover:bg-surface-lighter flex-shrink-0"
        on:click="{saveEdit}"
      >
        <Check size="{14}" class="text-primary" />
      </button>
      <button
        class="p-1 rounded hover:bg-surface-lighter flex-shrink-0"
        on:click="{cancelEdit}"
      >
        <X size="{14}" class="text-gray-500" />
      </button>
    </div>
  {:else}
    <span
      class="flex-1 text-sm {subtask.is_completed
        ? 'line-through text-gray-500'
        : 'text-on-surface'}"
    >
      {subtask.title}
    </span>

    {#if !readonly}
      <div
        class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          class="p-1 rounded hover:bg-surface-lighter text-gray-500 hover:text-on-surface"
          on:click="{startEdit}"
          title="Edit subtask"
        >
          <Edit3 size="{14}" />
        </button>
        <button
          class="p-1 rounded hover:bg-surface-lighter text-gray-500 hover:text-error"
          on:click="{handleDelete}"
          title="Delete subtask"
        >
          <Trash2 size="{14}" />
        </button>
      </div>
    {/if}
  {/if}
</div>
