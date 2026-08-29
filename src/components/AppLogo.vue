<script setup lang="ts">
defineEmits<{ 'go-home': [] }>()
// Brand mark for "Color System". A ramp of three rounded swatches ascending
// left→right — an echo of the site's signature color-ramp motif. The center
// bar is the brand accent (burnt orange); the flanking bars are "ink" that
// flips white↔charcoal with the theme so it reads on both tile shades.
</script>

<template>
  <a href="#" @click.prevent="$emit('go-home')" class="flex items-center gap-2.5 min-w-0 group" title="Back to overview">
    <div
      class="logo-tile w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-150 group-active:scale-95"
    >
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="bar-ink" x="1" y="8" width="6" height="12" rx="3" />
        <rect fill="#C2410C" x="9" y="3" width="6" height="17" rx="3" />
        <rect class="bar-ink-2" x="17" y="11" width="6" height="9" rx="3" />
      </svg>
    </div>
    <span class="text-[15px] font-semibold tracking-tight text-[#18181B] whitespace-nowrap"
      >Color <span class="logo-accent">System</span></span>
  </a>
</template>

<style scoped>
.logo-tile {
  background: #18181B;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
.bar-ink {
  fill: #ffffff;
}
.bar-ink-2 {
  fill: rgba(255, 255, 255, 0.55);
}
.logo-accent {
  color: #C2410C;
}
/* Dark overrides live in dark.css (global), same as every other token there. */
</style>