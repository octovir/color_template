<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ColorLibrary, PalettePreset, TabId } from '../types'
import { flattenSwatches } from '../composables/useSearch'
import { useClipboard } from '../composables/useClipboard'
import { bestTextOn } from '../lib/color'
import { Search } from 'lucide-vue-next'

const props = defineProps<{ library: ColorLibrary; presets: PalettePreset[] }>()
const emit = defineEmits<{ navigate: [tab: TabId]; search: [query: string] }>()

const { copy } = useClipboard()

const allSwatches = computed(() => flattenSwatches(props.library.categories, props.library.chartColors))
const totalColors = computed(() => allSwatches.value.length)
const totalFamilies = computed(() => props.library.categories.reduce((n, c) => n + c.families.length, 0))
const totalPalettes = computed(() => props.presets.reduce((n, p) => n + p.palettes.length, 0))
const totalTypes = computed(() => props.presets.length)

// Featured family ramps on the home page — one per hue region.
const rampFamilies = computed(() => {
  const names = ['Blue', 'Emerald', 'Orange', 'Violet']
  return names
    .map((n) => props.library.categories.flatMap((c) => c.families).find((f) => f.name === n))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
})

const tasteFamilies = computed(() => {
  const names = ['Blue', 'Emerald']
  return names
    .map((n) => props.library.categories.flatMap((c) => c.families).find((f) => f.name === n))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
})

const stats = computed(() => [
  { value: totalColors.value, label: 'curated colors' },
  { value: totalFamilies.value, label: 'hue families' },
  { value: totalPalettes.value, label: 'ready palettes' },
  { value: totalTypes.value, label: 'site types' },
])

const query = ref('')

function goSearch() {
  if (query.value.trim()) emit('search', query.value.trim())
  else emit('navigate', 'palette')
}
</script>

<template>
  <div class="space-y-10 sm:space-y-14 fade-in">
    <!-- Intro + search -->
    <section class="pt-4 sm:pt-10">
      <div class="max-w-2xl">
        <h1
          class="text-[34px] leading-[1.12] sm:text-[44px] sm:leading-[1.08] lg:text-[54px] lg:leading-[1.06] font-semibold tracking-tight text-[#18181B] text-balance"
        >
          Every color your interface needs, curated and one click away.
        </h1>
        <p class="text-[14px] sm:text-[16px] leading-relaxed text-[#71717A] mt-4 sm:mt-5 max-w-xl">
          245 hand-vetted swatches across 22 hue families, plus 46 ready-made palettes for 15 site types. Search in
          Thai or English, or browse the wall below.
        </p>

        <!-- Big search -->
        <div class="relative mt-6 sm:mt-8 max-w-xl">
          <Search
            class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none"
          />
          <input
            v-model="query"
            type="text"
            placeholder="Search Thai or English… e.g. สีฟ้าเข้ม, dark teal, 950"
            @keydown.enter="goSearch"
            class="glass-field h-12 sm:h-14 w-full rounded-full pl-11 sm:pl-12 pr-16 text-[13px] sm:text-[14px] text-[#18181B] outline-none"
          />
          <kbd
            class="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-2 h-6 rounded-md border border-[#E4E4E7] bg-white text-[10px] font-semibold text-[#71717A]"
          >
            Enter ↵
          </kbd>
        </div>
        <p class="text-[11px] text-[#A1A1AA] mt-2.5">Press Enter to open the full palette with your query applied.</p>
      </div>
    </section>

    <!-- Featured family ramps -->
    <section>
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
        <h2 class="text-[15px] sm:text-base font-semibold text-[#18181B]">Featured families</h2>
        <span class="text-[11px] text-[#A1A1AA]">click any shade to copy</span>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          v-for="f in rampFamilies"
          :key="f.name"
          class="glass rounded-2xl overflow-hidden"
        >
          <div class="flex items-center justify-between gap-2 px-3.5 py-2.5">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: f.hex500 }"></span>
              <span class="text-[12px] font-semibold truncate" :style="{ color: f.hex500 }">{{ f.name }}</span>
            </div>
            <span class="text-[10px] font-mono text-[#A1A1AA] shrink-0">{{ f.shades.length }} steps</span>
          </div>
          <div class="grid grid-cols-1">
            <button
              v-for="[shade, hex] in f.shades"
              :key="shade"
              @click="copy(hex.toUpperCase())"
              :title="`${f.name} ${shade} · ${hex.toUpperCase()}`"
              class="group relative flex items-center justify-between px-3.5 h-7 hover:brightness-110 active:brightness-125 transition-[filter] touch-manipulation"
              :style="{ background: hex }"
            >
              <span
                class="text-[9px] font-semibold font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ color: bestTextOn(hex) }"
              >
                {{ shade }}
              </span>
              <span
                class="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                :style="{ color: bestTextOn(hex) }"
              >
                {{ hex.toUpperCase() }}
              </span>
            </button>
          </div>
        </div>
      </div>
      <p class="text-[11px] text-[#A1A1AA] mt-2.5">
        Four families at full scale, 50 to 950 — all {{ totalColors }} colors live in the Full Palette tab.
      </p>
    </section>

    <!-- Stats -->
    <section class="grid grid-cols-2 sm:grid-cols-4 sm:divide-x divide-[#E4E4E7] border-y border-[#E4E4E7]">
      <div v-for="s in stats" :key="s.label" class="px-2 sm:px-6 py-4 sm:py-5">
        <div class="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B] tabular-nums">{{ s.value }}</div>
        <div class="text-[11px] sm:text-[12px] text-[#71717A] mt-0.5">{{ s.label }}</div>
      </div>
    </section>

    <!-- Taste strips -->
    <section class="glass rounded-2xl p-6">
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 class="text-[15px] font-semibold text-[#18181B]">A taste of the library</h2>
        <span class="text-[11px] text-[#A1A1AA]">click any shade to copy</span>
      </div>
      <p class="text-[13px] text-[#71717A] mt-1.5">
        Two families at full scale, 50 to 950. The complete sets live in the Full Palette tab.
      </p>
      <div class="space-y-5 mt-5">
        <div v-for="f in tasteFamilies" :key="f.name">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[12px] font-semibold" :style="{ color: f.hex500 }">{{ f.name }}</span>
            <span class="text-[10px] font-mono text-[#A1A1AA]">{{ f.shades.length }} steps · 50 → 950</span>
          </div>
          <div class="flex h-10 sm:h-11 rounded-lg overflow-hidden border border-[#E4E4E7]">
            <button
              v-for="[shade, hex] in f.shades"
              :key="shade"
              @click="copy(hex.toUpperCase())"
              :title="`${f.name} ${shade} · ${hex.toUpperCase()}`"
              class="flex-1 hover:brightness-110 active:brightness-125 transition-[filter] touch-manipulation"
              :style="{ background: hex }"
            ></button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
