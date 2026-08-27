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
const onPrimarySub = computed(() => hexToRgba(onPrimary.value, 0.75))

// The mockup reads as a real page in a browser window — the address pill
// derives from the palette name so it changes with the selection.
const url = computed(() => {
  const slug = props.palette.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'brand'}.design`
})
</script>

<template>
  <!-- Live usage preview: how the palette would look on a real web page,
       framed as a browser window. Every role appears once — Primary (brand
       dot / hero band / featured card), Secondary (nav links / list dots),
       Accent (CTA / list dots), Background (page), Surface (chrome + cards),
       Text (type + skeleton bars). -->
  <div
    class="rounded-xl overflow-hidden border border-[#E4E4E7] shadow-sm"
    :style="{ background: C.Background }"
  >
    <!-- Browser chrome -->
    <div
      class="flex items-center gap-2 px-3 py-1.5"
      :style="{ background: C.Surface, borderBottom: `1px solid ${mutedBorder}` }"
    >
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="w-2.5 h-2.5 rounded-full" style="background: #ff5f57"></span>
        <span class="w-2.5 h-2.5 rounded-full" style="background: #febc2e"></span>
        <span class="w-2.5 h-2.5 rounded-full" style="background: #28c840"></span>
      </div>
      <div class="flex-1 flex justify-center min-w-0">
        <span class="max-w-full truncate text-[9px] font-mono tracking-tight" :style="{ color: hexToRgba(C.Text, 0.55) }">
          {{ url }}
        </span>
      </div>
      <span class="w-7 shrink-0"></span>
    </div>

    <!-- Navbar -->
    <div
      class="flex items-center justify-between gap-2 px-4 py-2.5 min-w-0"
      :style="{ background: C.Surface, borderBottom: `1px solid ${mutedBorder}` }"
    >
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="w-3 h-3 rounded-full shrink-0" :style="{ background: C.Primary }"></span>
        <span class="text-[12px] font-bold tracking-tight truncate" :style="{ color: C.Text }">Brand</span>
      </div>
      <div class="flex items-center gap-3 text-[10px] font-medium shrink-0">
        <span :style="{ color: C.Secondary }">Home</span>
        <span :style="{ color: C.Secondary }">Products</span>
        <span :style="{ color: C.Secondary }">About</span>
        <span class="px-2 py-0.5 rounded-md text-[9px] font-bold" :style="{ background: C.Accent, color: onAccent }">CTA</span>
      </div>
    </div>

    <!-- Hero -->
    <div class="px-4 pt-4 pb-3.5" :style="{ background: C.Background }">
      <div class="rounded-xl px-4 py-4" :style="{ background: C.Primary }">
        <h5 class="text-[14px] font-bold tracking-tight leading-snug" :style="{ color: onPrimary }">
          Build something beautiful
        </h5>
        <p class="text-[10px] mt-1 mb-3.5 leading-relaxed" :style="{ color: onPrimarySub }">
          A short subline describing the product or service.
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1.5 rounded-lg text-[10px] font-bold" :style="{ background: C.Accent, color: onAccent }">
            Get started
          </span>
          <span
            class="px-3 py-1.5 rounded-lg text-[10px] font-bold"
            :style="{ background: hexToRgba(onPrimary, 0.15), color: onPrimary }"
          >
            Learn more
          </span>
        </div>
      </div>
    </div>

    <!-- Content: asymmetric feature card + list card -->
    <div class="px-4 pb-4 grid grid-cols-5 gap-2" :style="{ background: C.Background }">
      <div class="col-span-3 rounded-lg p-3" :style="{ background: C.Surface, border: `1px solid ${mutedBorder}` }">
        <div class="w-5 h-5 rounded-md mb-2" :style="{ background: C.Primary }"></div>
        <div class="h-2 rounded-sm mb-1.5" :style="{ background: C.Text, opacity: 0.8 }"></div>
        <div class="h-2 rounded-sm mb-1.5 w-5/6" :style="{ background: C.Text, opacity: 0.4 }"></div>
        <div class="h-2 rounded-sm w-2/3" :style="{ background: C.Text, opacity: 0.25 }"></div>
      </div>
      <div class="col-span-2 rounded-lg p-3" :style="{ background: C.Surface, border: `1px solid ${mutedBorder}` }">
        <div v-for="(dot, i) in ['Accent', 'Primary', 'Accent']" :key="i" class="flex items-center gap-1.5 mb-1.5 last:mb-0">
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: C[dot as 'Accent' | 'Primary'] }"></span>
          <span class="h-2 rounded-sm flex-1" :style="{ background: C.Text, opacity: [0.7, 0.5, 0.35][i] }"></span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="px-4 py-2.5 flex items-center justify-between gap-3 min-w-0"
      :style="{ background: C.Surface, borderTop: `1px solid ${mutedBorder}` }"
    >
      <span class="text-[9px] font-semibold shrink-0" :style="{ color: hexToRgba(C.Text, 0.65) }">© 2026 Brand</span>
      <span class="text-[9px] font-semibold truncate" :style="{ color: hexToRgba(C.Text, 0.45) }">{{ palette.name }}</span>
    </div>
  </div>
</template>
