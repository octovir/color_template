<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ColorCategory, ColorLibrary, PalettePreset, TabId } from '../types'
import { flattenSwatches } from '../composables/useSearch'
import { useClipboard } from '../composables/useClipboard'
import { Palette, Wand2, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{ library: ColorLibrary; presets: PalettePreset[] }>()
const emit = defineEmits<{ navigate: [tab: TabId] }>()

const { copy } = useClipboard()

const totalColors = computed(() => flattenSwatches(props.library.categories, props.library.chartColors).length)
const totalFamilies = computed(() => props.library.categories.reduce((n, c) => n + c.families.length, 0))
const totalPalettes = computed(() => props.presets.reduce((n, p) => n + p.palettes.length, 0))
const totalTypes = computed(() => props.presets.length)

// Count-up stats
const statColors = ref(0)
const statFamilies = ref(0)
const statPalettes = ref(0)
const statTypes = ref(0)

function animateCount(setVal: (n: number) => void, target: number) {
  const dur = 900
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min((t - t0) / dur, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    setVal(Math.round(target * eased))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  const grid = document.getElementById('overview-stats')
  if (!grid) return
  if (!('IntersectionObserver' in window)) {
    statColors.value = totalColors.value
    statFamilies.value = totalFamilies.value
    statPalettes.value = totalPalettes.value
    statTypes.value = totalTypes.value
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount((n) => (statColors.value = n), totalColors.value)
          animateCount((n) => (statFamilies.value = n), totalFamilies.value)
          animateCount((n) => (statPalettes.value = n), totalPalettes.value)
          animateCount((n) => (statTypes.value = n), totalTypes.value)
          io.disconnect()
        }
      })
    },
    { threshold: 0.4 },
  )
  io.observe(grid)
})

const tasteFamilies = computed(() => {
  const names = ['Blue', 'Emerald']
  return names
    .map((n) => props.library.categories.flatMap((c) => c.families).find((f) => f.name === n))
    .filter((f): f is NonNullable<typeof f> => Boolean(f))
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 fade-in">
    <!-- Hero -->
    <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm overflow-hidden">
      <div class="h-1.5 bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#10B981] gradient-animate"></div>
      <div class="p-6 sm:p-8 lg:p-10">
        <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717A]">UX/UI Color Guidelines</span>
        <h2 class="text-2xl lg:text-[32px] font-extrabold tracking-tight text-[#09090B] mt-2 leading-tight">
          One color system.<br class="hidden lg:block" />
          <span class="grad-text gradient-animate">Every decision covered.</span>
        </h2>
        <p class="text-sm text-[#71717A] mt-3 max-w-2xl leading-relaxed">
          A complete, curated color library: 245 hand-vetted swatches across 22 families, plus 46 ready-made palettes
          matched to 15 site types. Standards-based, contrast-checked, and one click away from your clipboard.
        </p>
        <div class="flex flex-wrap gap-2 mt-6">
          <button
            @click="emit('navigate', 'palette')"
            class="bg-[#09090B] hover:bg-[#27272A] text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse the Full Palette
          </button>
          <button
            @click="emit('navigate', 'picker')"
            class="bg-white hover:bg-[#F4F4F5] text-[#09090B] border border-[#E4E4E7] text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Find a Palette
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div id="overview-stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-5">
        <div class="text-2xl font-extrabold grad-text tracking-tight">{{ statColors }}</div>
        <div class="text-[11px] font-bold text-[#71717A] mt-1 uppercase tracking-wide">Curated colors</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-5">
        <div class="text-2xl font-extrabold grad-text tracking-tight">{{ statFamilies }}</div>
        <div class="text-[11px] font-bold text-[#71717A] mt-1 uppercase tracking-wide">Hue families</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-5">
        <div class="text-2xl font-extrabold grad-text tracking-tight">{{ statPalettes }}</div>
        <div class="text-[11px] font-bold text-[#71717A] mt-1 uppercase tracking-wide">Ready palettes</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-5">
        <div class="text-2xl font-extrabold grad-text tracking-tight">{{ statTypes }}</div>
        <div class="text-[11px] font-bold text-[#71717A] mt-1 uppercase tracking-wide">Site types</div>
      </div>
    </div>

    <!-- Section cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        @click="emit('navigate', 'palette')"
        class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-6 flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(9,9,11,0.08)]"
      >
        <div class="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE] flex items-center justify-center mb-4">
          <Palette class="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <h3 class="text-[15px] font-bold text-[#09090B]">Full Palette</h3>
        <p class="text-[12px] text-[#71717A] mt-1.5 leading-relaxed flex-1">
          The entire library in one place — 245 swatches across 22 families, from pure white &amp; black to every hue,
          plus a 12-color categorical set for charts. Filter live by name, hex, or shade.
        </p>
        <span class="mt-5 self-start inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8B5CF6]">
          Open library <ArrowRight class="w-3 h-3" />
        </span>
      </div>
      <div
        @click="emit('navigate', 'picker')"
        class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-6 flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(9,9,11,0.08)]"
      >
        <div class="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center mb-4">
          <Wand2 class="w-5 h-5 text-[#0D9488]" />
        </div>
        <h3 class="text-[15px] font-bold text-[#09090B]">Palette Picker</h3>
        <p class="text-[12px] text-[#71717A] mt-1.5 leading-relaxed flex-1">
          Tell us what you're building — 15 site types, 46 hand-tuned palettes. Preview any palette live on a page
          mockup, then copy the colors or grab them as CSS variables.
        </p>
        <span class="mt-5 self-start inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0D9488]">
          Open picker <ArrowRight class="w-3 h-3" />
        </span>
      </div>
    </div>

    <!-- Taste strips -->
    <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-6">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-[15px] font-bold text-[#09090B]">A taste of the library</h3>
        <span class="text-[10px] font-bold text-[#71717A]">click any shade to copy</span>
      </div>
      <p class="text-[12px] text-[#71717A] mb-5">Two families at full scale — 50 to 950. The complete sets live in the Full Palette tab.</p>
      <div class="space-y-4">
        <div v-for="f in tasteFamilies" :key="f.name">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-bold" :style="{ color: f.hex500 }">{{ f.name }}</span>
            <span class="text-[10px] font-mono text-[#71717A]">50 → 950 · {{ f.shades.length }} steps</span>
          </div>
          <div class="flex h-10 rounded-lg overflow-hidden border border-[#E4E4E7]">
            <button
              v-for="[shade, hex] in f.shades"
              :key="shade"
              @click="copy(hex.toUpperCase())"
              :title="`${f.name} ${shade} · ${hex.toUpperCase()}`"
              class="flex-1 hover:opacity-75 transition-opacity"
              :style="{ background: hex }"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
