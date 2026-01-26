<script>
  import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Edit3,
    Plus,
    Trash2,
    X,
  } from "lucide-svelte";
  import {
    addSubtask,
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
  let editDeadline = todo.due_date || "";
  let newSubtaskTitle = "";
  let showAddSubtask = false;

  $: progress = getTodoProgress(todo);
  $: hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  $: isDone = isTodoDone(todo);
  $: isOverdue =
    todo.is_global && todo.due_date && isDeadlinePassed(todo.due_date);
  $: daysUntilDeadline =
    todo.is_global && todo.due_date
      ? getDaysUntilDeadline(todo.due_date)
      : null;

  function isDeadlinePassed(dateStr) {
    if (!dateStr) return false;
    const today = new Date().toISOString().split("T")[0];
    return dateStr < today;
  }

  function getDaysUntilDeadline(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr + "T00:00:00");
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function formatDeadline(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }

  function startEdit() {
    editTitle = todo.title;
    editDescription = todo.description || "";
    editDeadline = todo.due_date || "";
    isEditing = true;
  }

  function saveEdit() {
    if (editTitle.trim()) {
      updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        due_date: todo.is_global ? editDeadline || null : todo.due_date,
      });
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
  }

  function handleDelete() {
    deleteTodo(todo.id);
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

<div
  class="card {isDone
    ? 'border border-secondary/30 bg-secondary/5'
    : ''} {isOverdue ? 'border border-error/50 bg-error/5' : ''}"
>
  <!-- Todo Header -->
  <div class="flex items-start gap-3">
    <!-- Expand/Collapse Button -->
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

    <!-- Todo Content -->
    <div class="flex-1 min-w-0">
      {#if isEditing && !readonly}
        <!-- Edit Mode -->
        <div class="space-y-3">
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

          <!-- Deadline picker for global tasks (no checkbox) -->
          {#if todo.is_global}
            <div class="flex items-center gap-2">
              <Calendar size="{16}" class="text-gray-500 flex-shrink-0" />
              <span class="text-sm text-gray-400">Deadline</span>
              <input
                type="date"
                class="input text-sm py-1"
                bind:value="{editDeadline}"
              />
              {#if editDeadline}
                <button
                  type="button"
                  class="text-gray-500 hover:text-error p-1 rounded hover:bg-surface-lighter"
                  on:click="{() => (editDeadline = '')}"
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
        <!-- View Mode -->
        <div class="flex items-start gap-2">
          <!-- Completed indicator -->
          {#if isDone}
            <CheckCircle2
              size="{20}"
              class="text-secondary flex-shrink-0 mt-0.5"
            />
          {:else if isOverdue}
            <AlertCircle size="{20}" class="text-error flex-shrink-0 mt-0.5" />
          {/if}

          <div class="flex-1">
            <h3
              class="font-medium {isDone
                ? 'text-secondary line-through'
                : 'text-on-surface'} {isOverdue ? 'text-error' : ''}"
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

            <!-- Deadline badge for global tasks -->
            {#if todo.is_global && todo.due_date}
              <div class="mt-2 flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                  {isOverdue
                    ? 'bg-error/20 text-error'
                    : daysUntilDeadline <= 3
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-primary/20 text-primary'}"
                >
                  <Calendar size="{12}" />
                  {#if isOverdue}
                    Overdue ({formatDeadline(todo.due_date)})
                  {:else if daysUntilDeadline === 0}
                    Due today
                  {:else if daysUntilDeadline === 1}
                    Due tomorrow
                  {:else}
                    Due {formatDeadline(todo.due_date)} ({daysUntilDeadline} days)
                  {/if}
                </span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Progress Bar (if has subtasks) -->
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

    <!-- Action Buttons -->
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
          class="p-2 rounded hover:bg-surface-lighter text-gray-500 hover:text-error transition-colors"
          on:click="{handleDelete}"
          title="Delete task"
        >
          <Trash2 size="{16}" />
        </button>
      </div>
    {/if}
  </div>

  <!-- Subtasks Section -->
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

      <!-- Add Subtask -->
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
