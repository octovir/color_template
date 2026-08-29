<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineEmits<{ 'go-home': [] }>()

// Brand mark for "Color System". Three swatches in triadic harmony — hues 120°
// apart so the trio always reads as a cohesive ramp — that slowly sweep
// through the hue wheel. Premium "เลื่อนผ่าน" cycling, not a flashing loop.
// Honors prefers-reduced-motion (stops at a static palette).

const reduced = ref(false)
const hue = ref(36) // start at warm amber

let raf = 0
let last = 0
const STEP = 28 // hue-deg per second — gentle

function onMountedAny() {
  reduced.value =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value) return
  const tick = (t: number) => {
    const dt = last ? (t - last) / 1000 : 0
    last = t
    hue.value = (hue.value + STEP * dt) % 360
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onMounted(onMountedAny)
onBeforeUnmount(() => cancelAnimationFrame(raf))

// Triadic harmony: single base hue, offsets +0 / +120 / +240, softened
// saturation/lightness so it stays crafted (not neon).
const bars = computed(() =>
  [0, 120, 240].map((off) => {
    const h = (hue.value + off) % 360
    return {
      fill: `hsl(${h.toFixed(1)} 72% 55%)`,
    }
  }),
)
const accent = computed(() => `hsl(${hue.value.toFixed(1)} 72% 45%)`)
</script>

<template>
  <a href="#" @click.prevent="$emit('go-home')" class="flex items-center gap-2.5 min-w-0 group" title="Back to overview">
    <div
      class="logo-tile w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-150 group-active:scale-95"
    >
      <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="8" width="6" height="12" rx="3" :style="{ fill: bars[0].fill }" />
        <rect x="9" y="3" width="6" height="17" rx="3" :style="{ fill: bars[1].fill }" />
        <rect x="17" y="11" width="6" height="9" rx="3" :style="{ fill: bars[2].fill }" />
      </svg>
    </div>
    <span class="text-[15px] font-semibold tracking-tight text-[#18181B] whitespace-nowrap"
      >Color <span class="logo-accent" :style="{ color: accent }">System</span></span>
  </a>
</template>

<style scoped>
.logo-tile {
  background: #18181B;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}
/* Slow buttery hue sweep — SVG fill transitions smoothly, premium not jumpy. */
.logo-tile rect {
  transition: fill 1.8s ease-in-out;
}
.logo-accent {
  transition: color 1.8s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  .logo-tile rect,
  .logo-accent {
    transition: none;
  }
}
</style>