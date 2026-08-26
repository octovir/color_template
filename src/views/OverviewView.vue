<script setup lang="ts">
import { computed } from 'vue'
import type { ColorLibrary, PalettePreset, TabId } from '../types'
import { flattenSwatches } from '../composables/useSearch'
import { useClipboard } from '../composables/useClipboard'
import { ArrowRight, Palette, Wand2 } from 'lucide-vue-next'

const props = defineProps<{ library: ColorLibrary; presets: PalettePreset[] }>()
const emit = defineEmits<{ navigate: [tab: TabId] }>()

const { copy } = useClipboard()

const allSwatches = computed(() => flattenSwatches(props.library.categories, props.library.chartColors))
const totalColors = computed(() => allSwatches.value.length)
const totalFamilies = computed(() => props.library.categories.reduce((n, c) => n + c.families.length, 0))
const totalPalettes = computed(() => props.presets.reduce((n, p) => n + p.palettes.length, 0))
const totalTypes = computed(() => props.presets.length)

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
</script>

<template>
  <div class="space-y-10 sm:space-y-14 fade-in">
    <!-- Hero -->
    <section class="pt-2 sm:pt-6">
      <div class="max-w-2xl">
        <h1
          class="text-[26px] leading-[1.25] sm:text-4xl sm:leading-[1.15] lg:text-[44px] lg:leading-[1.1] font-semibold tracking-tight text-[#18181B] text-balance"
        >
          Every color your interface needs, curated and one click away.
        </h1>
        <p class="text-[14px] sm:text-[15px] leading-relaxed text-[#71717A] mt-3 sm:mt-4 max-w-xl">
          245 hand-vetted swatches across 22 hue families, plus 46 ready-made palettes for 15 site types.
          Standards-based, contrast-checked, and copied to your clipboard with one click.
        </p>
        <div class="flex flex-wrap items-center gap-2.5 mt-6 sm:mt-7">
          <button
            @click="emit('navigate', 'palette')"
            class="h-10 px-4 sm:px-5 rounded-lg bg-[#18181B] text-[#FAFAFA] text-[13px] font-semibold hover:bg-[#27272A] active:scale-[0.98] transition-all"
          >
            Browse the full palette
          </button>
          <button
            @click="emit('navigate', 'picker')"
            class="h-10 px-4 sm:px-5 rounded-lg bg-white border border-[#E4E4E7] text-[13px] font-medium text-[#18181B] hover:border-[#D4D4D8] hover:bg-[#F4F4F5] active:scale-[0.98] transition-all"
          >
            Find a palette
          </button>
        </div>
      </div>

      <!-- Signature: the whole library as a color wall -->
      <div class="relative mt-8 sm:mt-10 rounded-xl overflow-hidden border border-[#E4E4E7] bg-white shadow-sm">
        <div class="flex overflow-x-auto nav-scroll">
          <button
            v-for="s in allSwatches"
            :key="s.family + s.shade + s.hex"
            @click="copy(s.hex)"
            :title="`${s.family} ${s.shade} · ${s.hex}`"
            class="wall-tile shrink-0 w-[7px] sm:w-[8px] h-9 sm:h-10 hover:brightness-110 active:brightness-125 transition-[filter]"
            :style="{ background: s.hex }"
          ></button>
        </div>
        <div class="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 bg-gradient-to-r from-[var(--wall-edge)] to-transparent"></div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 bg-gradient-to-l from-[var(--wall-edge)] to-transparent"></div>
      </div>
      <p class="text-[11px] sm:text-[12px] text-[#A1A1AA] mt-2">
        All {{ totalColors }} colors in one strip — scroll to browse, click any swatch to copy.
      </p>
    </section>

    <!-- Stats -->
    <section
      class="grid grid-cols-2 sm:grid-cols-4 sm:divide-x divide-[#E4E4E7] border-y border-[#E4E4E7]"
    >
      <div v-for="s in stats" :key="s.label" class="px-2 sm:px-6 py-4 sm:py-5">
        <div class="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B] tabular-nums">{{ s.value }}</div>
        <div class="text-[11px] sm:text-[12px] text-[#71717A] mt-0.5">{{ s.label }}</div>
      </div>
    </section>

    <!-- Section cards -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <button
        @click="emit('navigate', 'palette')"
        class="group text-left bg-white rounded-xl border border-[#E4E4E7] p-6 hover:border-[#D4D4D8] hover:shadow-sm active:scale-[0.99] transition-all"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-[15px] font-semibold text-[#18181B]">Full Palette</h2>
            <p class="text-[13px] leading-relaxed text-[#71717A] mt-1.5">
              The entire library in one place — 245 swatches across 22 families, from pure white and black to every
              hue, plus a 12-color categorical set for charts. Filter live by name, hex, or shade.
            </p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-[#F4F4F5] text-[#52525B] flex items-center justify-center shrink-0">
            <Palette class="w-5 h-5" />
          </div>
        </div>
        <span
          class="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#18181B] group-hover:gap-2.5 transition-all"
        >
          Open library <ArrowRight class="w-4 h-4" />
        </span>
      </button>

      <button
        @click="emit('navigate', 'picker')"
        class="group text-left bg-white rounded-xl border border-[#E4E4E7] p-6 hover:border-[#D4D4D8] hover:shadow-sm active:scale-[0.99] transition-all"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <h2 class="text-[15px] font-semibold text-[#18181B]">Palette Picker</h2>
            <p class="text-[13px] leading-relaxed text-[#71717A] mt-1.5">
              Tell us what you're building — 15 site types, 46 hand-tuned palettes. Preview any palette live on a
              page mockup, check its contrast, then copy the colors or grab them as CSS variables.
            </p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-[#F4F4F5] text-[#52525B] flex items-center justify-center shrink-0">
            <Wand2 class="w-5 h-5" />
          </div>
        </div>
        <span
          class="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#18181B] group-hover:gap-2.5 transition-all"
        >
          Open picker <ArrowRight class="w-4 h-4" />
        </span>
      </button>
    </section>

    <!-- Taste strips -->
    <section class="bg-white rounded-xl border border-[#E4E4E7] p-6">
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
