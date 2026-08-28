<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ColorLibrary } from '../types'
import { searchLibrary } from '../composables/useSearch'
import { useClipboard } from '../composables/useClipboard'
import { bestTextOn } from '../lib/color'
import { Search, SearchX, X } from 'lucide-vue-next'

const props = defineProps<{ library: ColorLibrary; active: boolean; presetQuery?: string | null }>()
const { copy, copyText } = useClipboard()

const query = ref('')

// Query coming from the Overview search box.
watch(
  () => props.presetQuery,
  (q) => {
    if (q) query.value = q
  },
)

const result = computed(() => searchLibrary(props.library.categories, props.library.chartColors, query.value))

// ---- shade-level filter (50..950, applied on top of the search) ----
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const shadeFilter = ref<string | null>(null)

const filtered = computed(() => {
  if (!shadeFilter.value) return result.value
  return {
    categories: result.value.categories
      .map((cat) => ({
        ...cat,
        families: cat.families
          .map((f) => ({ ...f, shades: f.shades.filter(([s]) => s === shadeFilter.value) }))
          .filter((f) => f.shades.length > 0),
      }))
      .filter((c) => c.families.length > 0),
    chartColors: [],
    total: result.value.categories
      .flatMap((c) => c.families)
      .flatMap((f) => f.shades)
      .filter(([s]) => s === shadeFilter.value).length,
  }
})

const rootEl = ref<HTMLElement | null>(null)
const navEl = ref<HTMLElement | null>(null)

// ---- sticky-bar workaround: Chromium fails to blur content scrolling behind a
// backdrop-filter element whose sticky `top` ≠ 0 (verified empirically). So the
// bar is static at the top of the page and switches to `position:fixed` (which
// blurs correctly) once the page scrolls past its natural position. A spacer
// keeps the layout from jumping. ----
const barFixed = ref(false)
const barHeight = ref(0)
const barLeft = ref(0)
const barWidth = ref(0)
let naturalTop = 0
let fixThreshold = 0

function checkBarPosition() {
  const bar = navEl.value
  const root = rootEl.value
  if (!bar || !root || root.offsetParent === null) return // hidden view (v-show)
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0
  if (!barFixed.value) {
    naturalTop = bar.getBoundingClientRect().top + window.scrollY
    fixThreshold = naturalTop - navH - 12
    if (window.scrollY > fixThreshold) {
      barHeight.value = bar.offsetHeight
      // Capture the static geometry: left-1/2 -translate-x-1/2 would re-center
      // the bar in the viewport and make it jump horizontally on scroll.
      const r = bar.getBoundingClientRect()
      barLeft.value = r.left
      barWidth.value = r.width
      barFixed.value = true
    }
  } else if (window.scrollY <= fixThreshold) {
    barFixed.value = false
  }
}

function onBarResize() {
  // Breakpoint switch / window resize while fixed → re-anchor from the static spot.
  if (barFixed.value) {
    barFixed.value = false
    requestAnimationFrame(checkBarPosition)
  }
}

function slug(cat: string) {
  return 'pal-cat-' + cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

// Category nav chips — always the FULL library (counts don't change while searching)
const navChips = computed(() => {
  const chips = props.library.categories.map((cat) => ({
    id: slug(cat.cat),
    label: cat.cat,
    count: cat.families.reduce((n, f) => n + f.shades.length, 0),
  }))
  chips.push({ id: 'pal-cat-categorical', label: 'Charts', count: props.library.chartColors.length })
  return chips
})

// ---- active chip tracking (which tone section is in view) ----
const activeCat = ref('')
function updateActiveCat() {
  const nav = navEl.value
  const root = rootEl.value
  if (!nav || !root || root.offsetParent === null) return // hidden view (v-show)
  const sections = [...root.querySelectorAll('.cat-block')] as HTMLElement[]
  if (!sections.length) return
  const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0
  const probe = hh + 160
  let current = sections[0]
  for (const sec of sections) if (sec.getBoundingClientRect().top <= probe) current = sec
  if (current.id === activeCat.value) return
  activeCat.value = current.id
  const activeChip = nav.querySelector('.cat-chip.cat-active') as HTMLElement | null
  if (activeChip) {
    nav.scrollTo({
      left: activeChip.offsetLeft - (nav.clientWidth - activeChip.clientWidth) / 2,
      behavior: 'smooth',
    })
  }
}

function jumpToCat(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  updateActiveCat()
}

function copyFamilyCss(name: string) {
  const f = props.library.categories.flatMap((c) => c.families).find((x) => x.name === name)
  if (!f) return
  const lines = f.shades.map(([s, h]) => `  --${f.name.toLowerCase()}-${String(s).toLowerCase()}: ${h.toUpperCase()};`).join('\n')
  copyText(`:root {\n${lines}\n}`, 'COPIED ' + f.name.toUpperCase() + ' CSS')
}

function onScroll() {
  checkBarPosition()
  updateActiveCat()
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onBarResize)
  checkBarPosition()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onBarResize)
})
watch(
  () => props.active,
  (on) => {
    if (on) requestAnimationFrame(() => {
      checkBarPosition()
      updateActiveCat()
    })
  },
)
</script>

<template>
  <div class="fade-in">
    <!-- Page header + search -->
    <div class="flex flex-col lg:flex-row lg:items-end gap-4 pb-6 border-b border-[#E4E4E7]">
      <div class="flex-1 min-w-0">
        <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-[#18181B]">The full palette</h2>
        <p class="text-[13px] sm:text-[14px] text-[#71717A] mt-1.5 max-w-2xl leading-relaxed">
          233 curated shades across 21 hue families on the industry-standard scale, plus pure white and black and a
          12-color categorical set for charts. Every swatch is hand-picked — the Palette Picker draws 100% of its
          colors from this library.
        </p>
      </div>
      <div class="flex items-center gap-2 w-full lg:w-auto">
        <div class="relative flex-1 lg:w-80">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none" />
          <input
            id="palette-search"
            v-model="query"
            type="text"
            placeholder="Search Thai or English… e.g. สีฟ้าเข้ม, dark teal, 950"
            class="glass-field h-11 w-full rounded-full pl-9 pr-8 text-[13px] text-[#18181B] outline-none focus:ring-2 focus:ring-[#18181B]/10"
          />
          <button
            v-if="query"
            @click="query = ''"
            title="Clear search"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#E4E4E7] text-[#52525B] flex items-center justify-center hover:bg-[#D4D4D8] transition-colors"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
        <span
          class="glass-chip shrink-0 text-[11px] font-medium text-[#71717A] px-3 h-11 flex items-center rounded-full tabular-nums"
        >
          {{ filtered.total }} colors
        </span>
      </div>
    </div>

    <!-- Filters: categories + shade levels. The bar is static at the top of the
         page and switches to position:fixed on scroll (Chromium fails to blur
         content behind a backdrop-filter element whose sticky top ≠ 0). The
         fixed geometry is captured from the static spot so the bar never jumps. -->
    <div
      ref="navEl"
      class="z-30 mt-6 mb-6 w-fit max-w-full"
      :class="barFixed ? 'fixed top-[calc(var(--nav-h,0px)_+_12px)] !mt-0 !mb-0' : ''"
      :style="barFixed ? { left: barLeft + 'px', width: barWidth + 'px' } : undefined"
    >
      <div class="glass-solid rounded-2xl">
        <div class="flex items-center gap-1.5 p-1.5 overflow-x-auto nav-scroll snap-x snap-proximity">
        <button
          v-for="chip in navChips"
          :key="chip.id"
          @click="jumpToCat(chip.id)"
          class="cat-chip shrink-0 snap-start px-4 py-2 rounded-full text-[12px] font-medium transition-colors touch-manipulation"
          :class="activeCat === chip.id ? 'cat-active' : ''"
        >
          {{ chip.label }} <span class="cat-count">{{ chip.count }}</span>
        </button>
      </div>
      <div class="flex items-center gap-1 p-1.5 border-t border-[#E4E4E7]/70 overflow-x-auto nav-scroll">
        <button
          @click="shadeFilter = null"
          class="shade-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors touch-manipulation"
          :class="shadeFilter === null ? 'shade-active' : ''"
        >
          All
        </button>
        <button
          v-for="s in SHADES"
          :key="s"
          @click="shadeFilter = shadeFilter === s ? null : s"
          class="shade-chip shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium font-mono transition-colors touch-manipulation"
          :class="shadeFilter === s ? 'shade-active' : ''"
        >
          {{ s }}
        </button>
        </div>
      </div>
    </div>

    <!-- Spacer that keeps the layout from jumping while the bar is fixed -->
    <div v-if="barFixed" aria-hidden="true" :style="{ height: barHeight + 'px' }"></div>

    <div ref="rootEl" class="space-y-12">
      <section
        v-for="cat in filtered.categories"
        :key="cat.cat"
        :id="slug(cat.cat)"
        class="cat-block scroll-mt-44"
      >
        <div class="flex items-baseline justify-between gap-4 mb-5">
          <div class="min-w-0">
            <h3 class="text-[17px] sm:text-lg font-semibold tracking-tight text-[#18181B]">{{ cat.cat }}</h3>
            <p class="text-[12px] sm:text-[13px] text-[#71717A] mt-1">{{ cat.note }}</p>
          </div>
          <span class="shrink-0 text-[11px] font-medium text-[#A1A1AA] whitespace-nowrap tabular-nums">
            {{ cat.families.reduce((n, f) => n + f.shades.length, 0) }} colors
          </span>
        </div>

        <div class="space-y-2">
          <div v-for="f in cat.families" :key="f.name" class="family-section">
            <div class="flex items-center justify-between gap-3 py-2.5 border-t border-[#E4E4E7]/80 first:border-t-0">
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: f.hex500 }"></span>
                <h4 class="text-[13px] font-semibold shrink-0" :style="{ color: f.hex500 }">{{ f.name }}</h4>
                <p class="text-[12px] text-[#A1A1AA] truncate">{{ f.note }}</p>
              </div>
              <button
                @click="copyFamilyCss(f.name)"
                class="glass-chip shrink-0 text-[11px] font-medium text-[#71717A] px-3 py-1.5 rounded-full"
              >
                Copy CSS
              </button>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-11 gap-1.5 sm:gap-2 pb-4">
              <div
                v-for="[shade, hex] in f.shades"
                :key="shade"
                class="swatch cursor-pointer group flex flex-col hover:-translate-y-0.5 transition-transform duration-150 touch-manipulation"
                @click="copy(hex.toUpperCase())"
              >
                <div class="relative h-14 sm:h-16 rounded-t-lg overflow-hidden border border-black/5" :style="{ background: hex }">
                  <span class="absolute top-1 left-1.5 text-[9px] font-semibold font-mono" :style="{ color: bestTextOn(hex) }">
                    {{ shade }}
                  </span>
                </div>
                <div class="border-x border-b border-[#E4E4E7] rounded-b-lg px-1.5 py-1 bg-white flex items-center justify-between gap-1">
                  <span class="text-[9px] font-mono text-[#71717A] truncate">{{ hex.toUpperCase() }}</span>
                  <span class="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-semibold text-[#A1A1AA]">COPY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categorical / chart set (hidden while a shade filter is active) -->
      <section v-if="!shadeFilter" id="pal-cat-categorical" class="cat-block scroll-mt-44">
        <div class="flex items-baseline justify-between gap-4 mb-5">
          <div class="min-w-0">
            <h3 class="text-[17px] sm:text-lg font-semibold tracking-tight text-[#18181B]">Categorical &amp; Charts</h3>
            <p class="text-[12px] sm:text-[13px] text-[#71717A] mt-1">
              12 distinct mid-tone hues for data visualization, multi-series charts, and category labels. Warm and
              cool hues alternate for maximum separation.
            </p>
          </div>
          <span class="shrink-0 text-[11px] font-medium text-[#A1A1AA] whitespace-nowrap tabular-nums">
            {{ filtered.chartColors.length }} colors
          </span>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          <div
            v-for="(c, i) in filtered.chartColors"
            :key="c.name"
            class="swatch cursor-pointer group flex flex-col hover:-translate-y-0.5 transition-transform duration-150 touch-manipulation"
            @click="copy(c.hex.toUpperCase())"
          >
            <div class="relative h-14 sm:h-16 rounded-t-lg overflow-hidden border border-black/5" :style="{ background: c.hex }">
              <span class="absolute top-1 left-1.5 text-[9px] font-semibold font-mono" :style="{ color: bestTextOn(c.hex) }">
                C{{ String(i + 1).padStart(2, '0') }}
              </span>
            </div>
            <div class="border-x border-b border-[#E4E4E7] rounded-b-lg px-1.5 py-1 bg-white flex items-center justify-between gap-1">
              <span class="text-[9px] font-mono text-[#71717A] truncate">{{ c.hex.toUpperCase() }}</span>
              <span class="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-semibold text-[#A1A1AA]">COPY</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="filtered.total === 0" class="text-center py-16">
      <SearchX class="w-8 h-8 mx-auto text-[#A1A1AA] mb-3" />
      <h3 class="text-[15px] font-semibold text-[#18181B]">No colors found</h3>
      <p class="text-[12px] text-[#71717A] mt-1 mb-5">
        Try another word — Thai or English, a shade level, or a hex code. For example:
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="ex in ['สีฟ้าเข้ม', 'dark teal', 'pastel', '#8B5CF6']"
          :key="ex"
          @click="query = ex; shadeFilter = null"
          class="glass-chip text-[11px] font-medium text-[#52525B] px-3 py-1.5 rounded-full"
        >
          {{ ex }}
        </button>
      </div>
    </div>
  </div>
</template>
