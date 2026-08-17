<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ColorLibrary, PalettePreset, TabId } from './types'
import { getColorLibrary, getPalettePresets } from './services/api'
import AmbientGlow from './components/AmbientGlow.vue'
import AppHeader from './components/AppHeader.vue'
import OverviewView from './views/OverviewView.vue'
import FullPaletteView from './views/FullPaletteView.vue'
import PalettePickerView from './views/PalettePickerView.vue'
import BackTop from './components/BackTop.vue'
import Toast from './components/Toast.vue'
import { Palette } from 'lucide-vue-next'

const activeTab = ref<TabId>('home')
const loaded = ref(false)
const library = ref<ColorLibrary>({ categories: [], chartColors: [], aliases: {} })
const presets = ref<PalettePreset[]>([])

function switchTab(tab: TabId) {
  activeTab.value = tab
}

function focusSearch() {
  switchTab('palette')
  setTimeout(() => {
    const el = document.getElementById('palette-search') as HTMLInputElement | null
    if (el) {
      el.focus()
      el.select()
    }
  }, 60)
}

// ⌘K / Ctrl+K — jump to the color search
function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault()
    focusSearch()
  }
}

// Sticky sub-nav offset: track the real header height (2 rows mobile / 1 row desktop)
function syncNavHeight() {
  const h = document.querySelector('header')
  if (h) document.documentElement.style.setProperty('--nav-h', h.offsetHeight + 'px')
}
let navResizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize() {
  if (navResizeTimer) clearTimeout(navResizeTimer)
  navResizeTimer = setTimeout(syncNavHeight, 150)
}

onMounted(async () => {
  try {
    const [lib, pres] = await Promise.all([getColorLibrary(), getPalettePresets()])
    library.value = lib
    presets.value = pres
  } finally {
    loaded.value = true
  }
  syncNavHeight()
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', onResize)
  window.addEventListener('load', syncNavHeight)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncNavHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('load', syncNavHeight)
  if (navResizeTimer) clearTimeout(navResizeTimer)
})
</script>

<template>
  <AmbientGlow />
  <AppHeader :active-tab="activeTab" @switch-tab="switchTab" @focus-search="focusSearch" />

  <main class="max-w-[1400px] mx-auto px-4 sm:px-8 mt-8">
    <template v-if="loaded">
      <OverviewView v-show="activeTab === 'home'" :library="library" :presets="presets" @navigate="switchTab" />
      <FullPaletteView v-show="activeTab === 'palette'" :library="library" :active="activeTab === 'palette'" />
      <PalettePickerView v-show="activeTab === 'picker'" :presets="presets" />
    </template>
  </main>

  <footer class="max-w-[1400px] mx-auto px-4 sm:px-8 mt-10">
    <div class="border-t border-[#E4E4E7] pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#10B981] gradient-animate flex items-center justify-center">
          <Palette class="w-3 h-3 text-white" />
        </div>
        <span class="text-[12px] font-bold text-[#09090B]">Color System</span>
        <span class="text-[11px] text-[#71717A]">— 245 colors · 22 families · 46 palettes · 15 site types</span>
      </div>
      <div class="flex items-center gap-3 text-[11px] font-semibold text-[#71717A]">
        <span>Built with Tailwind CSS &amp; Lucide</span>
        <span class="hidden sm:inline">·</span>
        <span>Click any swatch to copy</span>
      </div>
    </div>
  </footer>

  <BackTop />
  <Toast />
</template>
