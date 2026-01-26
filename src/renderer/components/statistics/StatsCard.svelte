<script>
  export let title;
  export let value;
  export let icon;
  export let iconColor = "text-primary";
  export let subtitle = null;
</script>

<div class="card">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      <p class="text-2xl font-bold text-on-surface mt-1">{value}</p>
      {#if subtitle}
        <p class="text-xs text-gray-500 mt-1">{subtitle}</p>
      {/if}
    </div>
    <div class="p-2 rounded-lg bg-surface-lighter">
      <svelte:component this="{icon}" size="{20}" class="{iconColor}" />
    </div>
  </div>
</div>
