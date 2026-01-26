<script>
  import { ChevronDown, ChevronRight } from "lucide-svelte";
  import {
    expandedFolders,
    openFile,
    toggleFolder,
  } from "$lib/stores/fileStore.js";
  import FileItem from "./FileItem.svelte";

  export let node;
  export let depth = 0;

  $: isExpanded = $expandedFolders.has(node.path);
  $: hasChildren =
    node.isDirectory && node.children && node.children.length > 0;

  function handleToggle() {
    if (node.isDirectory) {
      toggleFolder(node.path);
    }
  }

  function handleDoubleClick() {
    if (!node.isDirectory) {
      openFile(node.path);
    }
  }
</script>

<div class="select-none">
  <!-- Current node -->
  <button
    class="w-full flex items-center gap-1 py-1 px-1 rounded hover:bg-surface-lighter text-sm text-left transition-colors group"
    style="padding-left: {depth * 12 + 4}px"
    on:click="{handleToggle}"
    on:dblclick="{handleDoubleClick}"
  >
    {#if node.isDirectory}
      {#if hasChildren}
        {#if isExpanded}
          <ChevronDown size="{14}" class="text-gray-500 flex-shrink-0" />
        {:else}
          <ChevronRight size="{14}" class="text-gray-500 flex-shrink-0" />
        {/if}
      {:else}
        <span class="w-3.5"></span>
      {/if}
    {:else}
      <span class="w-3.5"></span>
    {/if}

    <FileItem {node} />
  </button>

  <!-- Children (if expanded) -->
  {#if node.isDirectory && isExpanded && node.children}
    <div>
      {#each node.children as child (child.path)}
        <svelte:self node="{child}" depth="{depth + 1}" />
      {/each}
    </div>
  {/if}
</div>
