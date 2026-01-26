<script>
  import { onMount, onDestroy } from "svelte";

  export let target = "body";

  let ref;
  let portal;

  onMount(() => {
    portal = document.createElement("div");
    portal.className = "portal";
    document.querySelector(target).appendChild(portal);
    portal.appendChild(ref);
  });

  onDestroy(() => {
    if (portal && portal.parentNode) {
      portal.parentNode.removeChild(portal);
    }
  });
</script>

<div style="display: contents;" bind:this="{ref}">
  <slot />
</div>
