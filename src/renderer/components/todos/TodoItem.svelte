<script>
  import { Archive, Check, CheckCircle2, ChevronDown, ChevronRight, Edit3, Plus, Trash2, X, } from "lucide-svelte";
  import {
    addSubtask,
    archiveTodo,
    deleteSubtask,
    deleteTodo,
    getTodoProgress,
    isTodoDone,
    updateSubtask,
    updateTodo,
  } from "$lib/stores/todoStore.js";
  import SubtaskItem from "./SubtaskItem.svelte";
  import TextInputWithEmoji from "$components/common/TextInputWithEmoji.svelte";
  import TextareaWithEmoji from "$components/common/TextareaWithEmoji.svelte";

  export let todo;
  export let readonly = false;

  let isExpanded = true;
  let isEditing = false;
  let editTitle = todo.title;
  let editDescription = todo.description || "";
  let newSubtaskTitle = "";
  let showAddSubtask = false;

  $: progress = getTodoProgress(todo);
  $: hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  $: isDone = isTodoDone(todo);

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function startEdit() {
    editTitle = todo.title;
    editDescription = todo.description || "";
    isEditing = true;
  }

  function saveEdit() {
    if (editTitle.trim()) {
      updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTodo(todo.id);
    }
  }

  function handleArchive() {
    archiveTodo(todo.id);
  }

  function handleAddSubtask() {
    if (newSubtaskTitle.trim()) {
      addSubtask(todo.id, newSubtaskTitle.trim());
      newSubtaskTitle = "";
      showAddSubtask = false;
    }
  }

  function handleSubtaskToggle(event) {
    const { subtaskId, isCompleted } = event.detail;
    updateSubtask(todo.id, subtaskId, { is_completed: isCompleted });
  }

  function handleSubtaskDelete(event) {
    const { subtaskId } = event.detail;
    deleteSubtask(todo.id, subtaskId);
  }

  function handleSubtaskEdit(event) {
    const { subtaskId, title } = event.detail;
    updateSubtask(todo.id, subtaskId, { title });
  }

  function handleSubtaskKeydown(event) {
    if (event.detail?.key === "Enter" || event.key === "Enter") {
      handleAddSubtask();
    } else if (event.detail?.key === "Escape" || event.key === "Escape") {
      showAddSubtask = false;
      newSubtaskTitle = "";
    }
  }

  function handleEditKeydown(event) {
    if (event.detail?.key === "Escape" || event.key === "Escape") {
      cancelEdit();
    }
  }
</script>

<div class="card {isDone ? 'border border-secondary/30 bg-secondary/5' : ''}">
  <div class="flex items-start gap-3">
    {#if hasSubtasks}
      <button
        class="mt-1 p-1 rounded hover:bg-surface-lighter transition-colors"
        on:click="{toggleExpand}"
      >
        {#if isExpanded}
          <ChevronDown size="{16}" class="text-gray-500" />
        {:else}
          <ChevronRight size="{16}" class="text-gray-500" />
        {/if}
      </button>
    {:else}
      <div class="w-6"></div>
    {/if}

    <div class="flex-1 min-w-0">
      {#if isEditing && !readonly}
        <div class="space-y-2">
          <TextInputWithEmoji
            bind:value="{editTitle}"
            placeholder="Task title"
            autofocus="{true}"
            on:keydown="{handleEditKeydown}"
          />
          <TextareaWithEmoji
            bind:value="{editDescription}"
            placeholder="Description (optional)"
            rows="{2}"
            on:keydown="{handleEditKeydown}"
          />
          <div class="flex gap-2">
            <button
              class="btn btn-primary btn-sm flex items-center gap-1"
              on:click="{saveEdit}"
            >
              <Check size="{14}" />
              Save
            </button>
            <button
              class="btn btn-ghost btn-sm flex items-center gap-1"
              on:click="{cancelEdit}"
            >
              <X size="{14}" />
              Cancel
            </button>
          </div>
        </div>
      {:else}
        <div class="flex items-start gap-2">
          {#if isDone}
            <CheckCircle2
              size="{20}"
              class="text-secondary flex-shrink-0 mt-0.5"
            />
          {/if}

          <div class="flex-1">
            <h3
              class="font-medium {isDone
                ? 'text-secondary line-through'
                : 'text-on-surface'}"
            >
              {todo.title}
            </h3>
            {#if todo.description}
              <p
                class="text-sm text-gray-400 mt-1 {isDone
                  ? 'line-through'
                  : ''}"
              >
                {todo.description}
              </p>
            {/if}
          </div>
        </div>

        {#if hasSubtasks}
          <div class="mt-2">
            <div class="flex items-center justify-between text-xs mb-1">
              <span
                class="{progress.isFullyCompleted
                  ? 'text-secondary'
                  : 'text-gray-500'}"
              >
                {progress.completed}/{progress.total} subtasks
              </span>
              <span
                class="{progress.isFullyCompleted
                  ? 'text-secondary font-medium'
                  : 'text-gray-500'}"
              >
                {progress.percentage}%
                {#if progress.isFullyCompleted}
                  ✓
                {/if}
              </span>
            </div>
            <div class="h-1.5 bg-surface-lighter rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300 {progress.isFullyCompleted
                  ? 'bg-secondary'
                  : 'bg-primary'}"
                style="width: {progress.percentage}%"
              ></div>
            </div>
          </div>
        {/if}
      {/if}
    </div>

    {#if !isEditing && !readonly}
      <div class="flex items-center gap-1">
        <button
          class="p-2 rounded hover:bg-surface-lighter text-gray-500 hover:text-on-surface transition-colors"
          on:click="{startEdit}"
          title="Edit task"
        >
          <Edit3 size="{16}" />
        </button>
        <button
          class="p-2 rounded hover:bg-surface-lighter text-gray-500 hover:text-secondary transition-colors"
          on:click="{handleArchive}"
          title="Archive task"
        >
          <Archive size="{16}" />
        </button>
        <button
          class="p-2 rounded hover:bg-surface-lighter text-gray-500 hover:text-error transition-colors"
          on:click="{handleDelete}"
          title="Delete task"
        >
          <Trash2 size="{16}" />
        </button>
      </div>
    {/if}
  </div>

  {#if isExpanded}
    <div
      class="mt-3 ml-6 border-l-2 {isDone
        ? 'border-secondary/30'
        : 'border-surface-lighter'} pl-4 space-y-2"
    >
      <!-- Existing Subtasks -->
      {#if hasSubtasks}
        {#each todo.subtasks as subtask (subtask.id)}
          <SubtaskItem
            {subtask}
            {readonly}
            on:toggle="{handleSubtaskToggle}"
            on:delete="{handleSubtaskDelete}"
            on:edit="{handleSubtaskEdit}"
          />
        {/each}
      {/if}

      {#if !readonly}
        {#if showAddSubtask}
          <div class="flex items-center gap-2">
            <TextInputWithEmoji
              bind:value="{newSubtaskTitle}"
              placeholder="Subtask title... ✨"
              autofocus="{true}"
              inputClass="text-sm py-1"
              on:keydown="{handleSubtaskKeydown}"
            />
            <button
              class="btn btn-primary btn-sm p-1"
              on:click="{handleAddSubtask}"
              disabled="{!newSubtaskTitle.trim()}"
            >
              <Check size="{16}" />
            </button>
            <button
              class="btn btn-ghost btn-sm p-1"
              on:click="{() => {
                showAddSubtask = false;
                newSubtaskTitle = '';
              }}"
            >
              <X size="{16}" />
            </button>
          </div>
        {:else}
          <button
            class="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors py-1"
            on:click="{() => (showAddSubtask = true)}"
          >
            <Plus size="{14}" />
            Add subtask
          </button>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
</style>
