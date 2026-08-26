<script setup lang="ts">
import { computed } from 'vue'
import type { Hex, Palette } from '../types'
import { bestTextOn, hexToRgba } from '../lib/color'

const props = defineProps<{ palette: Palette }>()

const C = computed(() => {
  const map: Record<string, Hex> = {}
  for (const [role, hex] of props.palette.colors) map[role] = hex
  return map
})
const onPrimary = computed(() => bestTextOn(C.value.Primary))
const onAccent = computed(() => bestTextOn(C.value.Accent))
const mutedBorder = computed(() => hexToRgba(C.value.Text, 0.12))
</script>

<template>
  <div class="rounded-xl overflow-hidden border border-[#E4E4E7] shadow-sm" :style="{ background: C.Background }">
    <div class="flex items-center justify-between px-4 py-2.5" :style="{ background: C.Surface, borderBottom: `1px solid ${mutedBorder}` }">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full" :style="{ background: C.Primary }"></div>
        <span class="text-[11px] font-semibold tracking-tight" :style="{ color: C.Text }">Brand</span>
      </div>
      <div class="flex items-center gap-3 text-[9px] font-medium">
        <span :style="{ color: C.Secondary }">Home</span>
        <span :style="{ color: C.Secondary }">Products</span>
        <span :style="{ color: C.Secondary }">About</span>
        <span class="px-2 py-0.5 rounded text-[8px] font-semibold" :style="{ background: C.Accent, color: onAccent }">CTA</span>
      </div>
    </div>

    <div class="px-4 py-5">
      <div class="rounded-lg px-4 py-5" :style="{ background: C.Primary }">
        <h5 class="text-[13px] font-semibold tracking-tight" :style="{ color: onPrimary }">Your headline goes here</h5>
        <p class="text-[9px] mt-1 mb-3" :style="{ color: hexToRgba(onPrimary, 0.8) }">
          A short subline describing the product or service.
        </p>
        <div class="flex gap-1.5">
          <span class="px-2.5 py-1 rounded text-[8px] font-semibold" :style="{ background: C.Accent, color: onAccent }">Primary action</span>
          <span class="px-2.5 py-1 rounded text-[8px] font-semibold" :style="{ background: hexToRgba(onPrimary, 0.15), color: onPrimary }">Secondary</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 mt-3">
        <div v-for="i in 3" :key="i" class="rounded-lg p-2.5" :style="{ background: C.Surface, border: `1px solid ${mutedBorder}` }">
          <div class="w-6 h-2 rounded-sm mb-1.5" :style="{ background: C.Primary }"></div>
          <div class="h-1.5 rounded-sm mb-1" :style="{ background: C.Text, opacity: 0.85 }"></div>
          <div class="h-1.5 rounded-sm" :style="{ background: C.Text, opacity: 0.35 }"></div>
        </div>
      </div>
    </div>

    <div class="px-4 py-2 flex justify-between items-center" :style="{ background: C.Primary }">
      <span class="text-[8px] font-bold" :style="{ color: onPrimary }">© 2026 Brand</span>
      <span class="text-[8px] font-bold" :style="{ color: hexToRgba(onPrimary, 0.7) }">{{ palette.name }}</span>
    </div>
  </div>
</template>
