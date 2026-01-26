<script>
  import { createEventDispatcher } from "svelte";

  export let checked = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    dispatch("change", { checked });
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked="{checked}"
  {disabled}
  class="toggle"
  class:checked
  class:disabled
  on:click="{toggle}"
>
  <span class="thumb"></span>
</button>

<style>
  .toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 48px;
    height: 26px;
    padding: 3px;
    border: none;
    border-radius: 13px;
    background-color: #3d3d3d;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
  }

  .toggle:hover:not(.disabled) {
    background-color: #4d4d4d;
  }

  .toggle.checked {
    background-color: #bb86fc;
  }

  .toggle.checked:hover:not(.disabled) {
    background-color: #c99dfc;
  }

  .toggle.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .thumb {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s ease;
  }

  .toggle.checked .thumb {
    transform: translateX(22px);
  }
</style>
