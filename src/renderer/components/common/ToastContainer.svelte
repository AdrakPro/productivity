<script>
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-svelte";
  import { toasts, dismissToast } from "$lib/stores/toastStore.js";

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-secondary/20 border-secondary/50 text-secondary",
    error: "bg-error/20 border-error/50 text-error",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    info: "bg-primary/20 border-primary/50 text-primary",
  };

  const iconColors = {
    success: "text-secondary",
    error: "text-error",
    warning: "text-yellow-400",
    info: "text-primary",
  };
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
  {#each $toasts as toast (toast.id)}
    <div
      class="flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm {colors[
        toast.type
      ]}"
      in:fly="{{ x: 100, duration: 300 }}"
      out:fade="{{ duration: 200 }}"
      animate:flip="{{ duration: 300 }}"
    >
      <svelte:component
        this="{icons[toast.type]}"
        size="{20}"
        class="{iconColors[toast.type]} flex-shrink-0 mt-0.5"
      />

      <div class="flex-1 min-w-0">
        <p class="text-sm text-on-surface">{toast.message}</p>

        {#if toast.action}
          <button
            class="mt-2 text-sm font-medium hover:underline {iconColors[
              toast.type
            ]}"
            on:click="{() => {
              toast.action.onClick();
              dismissToast(toast.id);
            }}"
          >
            {toast.action.label}
          </button>
        {/if}
      </div>

      <button
        class="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-on-surface transition-colors flex-shrink-0"
        on:click="{() => dismissToast(toast.id)}"
      >
        <X size="{16}" />
      </button>
    </div>
  {/each}
</div>
